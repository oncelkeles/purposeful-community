const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const communityRouter = require("./routes/communityRoutes");
const postTypeRouter = require("./routes/postTypeRoutes");
const postRouter = require("./routes/postRoutes");
const invitationRouter = require("./routes/invitationRoutes");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

// global middlewares

// security HTTP headers
app.use(helmet());

// dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// limit requests from same IP for same API
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP! Please try again in an hour.",
});
app.use("/api", limiter);

// body parser, reading data from to body into req.body
app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(cookieParser());

// data sanitization aganist NoSQL query injection
app.use(mongoSanitize());

// data sanitization aganist XSS
app.use(xss());

// prevent parameter polution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// serving static files
// app.use(express.static(`${__dirname}/public`));

// test middleware, get timestamp
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/community", communityRouter);
app.use("/api/v1/postType", postTypeRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/invitations", invitationRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
