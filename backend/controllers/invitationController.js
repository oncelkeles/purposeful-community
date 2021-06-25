const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

const Community = require("./../models/communityModel");
const Invitation = require("./../models/invitationModel");

exports.createInvitation = catchAsync(async (req, res, next) => {
  console.log("communityId", req.body);
  const communityId = req.body.from.community;
  console.log(communityId);
  const community = await Community.findById(communityId);
  let temp = {
    ...req.body,
  };
  temp = {
    ...temp,
    from: {
      ...temp.from,
      communityName: community.name,
    },
  };
  req.body = { ...temp };
  /* req.body = {
        ...req.body,
        from: 
    } */
  if (community == null) {
    return next(new AppError("No community found with that ID", 404));
  }

  if (
    community.organizers.includes(req.user.id) ||
    community.creator.id == req.user.id
  ) {
    var invitationTo = req.body.to.user;
    var user = await User.findById(invitationTo);
    let bool = user.invites.some(
      (x) => x.community == communityId && (x.status == 1 || x.status == 2)
    );
    if (bool) {
      return next(new AppError("An invitation already exists.", 404));
    }
    const doc = await Invitation.create(req.body);

    await User.findByIdAndUpdate(
      user._id,
      {
        invites: [
          ...user.invites,
          { _id: doc._id, community: community._id, status: 1 },
        ],
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  } else {
    return next(new AppError("No permisson.", 401));
  }
});

exports.getInvitations = catchAsync(async (req, res, next) => {
  console.log("here");
  const userId = req.user.id;
  if (userId == null) {
    return next(new AppError("User not found.", 401));
  }
  var responseList = [];
  const invitations = await Invitation.find({
    $and: [
      {
        "to.user": userId,
      },
      {
        status: 1,
      },
    ],
  });
  invitations.forEach((invitation) => {
    let x = invitation.from;
    let c = x.community;
    let name = x.communityName;

    console.log(c);
    var respObject = {};
    respObject.invitationId = invitation._id;
    respObject.status = invitation.status;
    respObject.community = c;
    respObject.communityName = name;
    responseList.unshift(respObject);
  });
  res.status(200).json({
    status: "success",
    data: {
      data: responseList,
    },
  });
});

exports.acceptInvitation = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const invitation = await Invitation.findById(req.params.invitationId);
  var personInvited = invitation.to;
  console.log(userId);
  console.log(personInvited.user);
  if (userId != personInvited.user) {
    return next(new AppError("Permission denied.", 401));
  }
  if (invitation.status !== 1) {
    return next(new AppError("Not allowed", 405));
  }
  //await User.findByIdAndUpdate(
  //    userId,
  //    { invites: [...invites, {status:2}] },
  //    {
  //      new: true,
  //      runValidators: true,
  //    }
  //);
  console.log(invitation.from.community);
  const comm = await Community.findById(invitation.from.community);
  await Community.findByIdAndUpdate(
    invitation.from.community,
    { members: [...comm.members, userId] },
    {
      new: true,
      runValidators: true,
    }
  );

  await Invitation.findByIdAndUpdate(
    invitation._id,
    { status: 2 },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      data: [],
    },
  });
});

exports.rejectInvitation = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const invitation = await Invitation.findById(req.params.invitationId);
  var personInvited = invitation.to;
  console.log(userId);
  console.log(personInvited.user);
  if (userId != personInvited.user) {
    return next(new AppError("Permission denied.", 401));
  }
  if (invitation.status !== 1) {
    return next(new AppError("Not allowed", 405));
  }
  console.log(invitation.from.community);

  await Invitation.findByIdAndUpdate(
    invitation._id,
    { status: 3 },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      data: [],
    },
  });
});
