const crypto = require("crypto");

const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const AppError = require("./../utils/appError");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const Email = require("./../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (statusCode, user, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("token", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  /* const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  }); */
  const newUser = await User.create(req.body);

  const url = `${req.protocol}://${req.get("host")}/me`;
  console.log(url);
  // await new Email(newUser, url).sendWelcome();

  createAndSendToken(201, newUser, res);
});

exports.login = catchAsync(async (req, res, next) => {
  //debugger;

  const { email, password } = req.body;

  // check if email & password exists
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // check if user exists & pass is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // if all ok, sent token
  createAndSendToken(200, user, res);
});

exports.logout = catchAsync((req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  
  // get token and check if it exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  
  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to get access.", 401)
    );
  }

  // verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does not exist!", 401)
    );
  }

  const checkPassword = await currentUser.changePasswordAfter(decoded.iat);
  // check if user changed password after token was issued
  if (checkPassword) {
    return next(
      new AppError("User recently changed password! Please login again.", 401)
    );
  }

  // grant access to protected route
  req.user = currentUser;
  // res.locals.user = currentUser;
  next();
});

// only for rendered pages, will be no errors
exports.isLoggedIn = async (req, res, next) => {
  // get token and check if it exists
  if (req.cookies.token) {
    try {
      const token = req.cookies.token;

      // verification
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      // check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      const checkPassword = await currentUser.changePasswordAfter(decoded.iat);
      // check if user changed password after token was issued
      if (checkPassword) {
        return next();
      }

      // there is a logged in user
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action!", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("No user with the given email address!", 404));
  }

  // generate random token
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH with your new password and passwordConfirm to: ${resetURL}.
  \nIf you didn't forget your password, ignore this e-mail.`;

  try {
    /* await sendEmail({
      email: user.email,
      subject: "Your Password Reset Token (valid for 10 min)",
      message,
    }); */
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token is sent to email. ",
    });
  } catch (err) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);

    return next(
      new AppError(
        "There was an error sending the e-mail. Please try again",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // if token not expired and there is user; set new password
  if (!user) {
    return next(new AppError("Token is invalid or expired", 404));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // update changedPasswordAt

  // log the user in and setJWT
  createAndSendToken(200, user, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // get user from collection
  const user = await User.findById(req.user.id).select("+password");

  console.log(user.name);

  // check if given current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong!", 401));
  }

  // if given current password is correct, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // login user, send jwt
  createAndSendToken(200, user, res);
});
