const User = require("./../models/userModel");
const Community = require("./../models/communityModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

exports.setUserIds = (req, res, next) => {
  if (!req.body.user)
    req.body.creator = {
      "@type": "Person",
      value: req.user.id,
    };
  next();
};

exports.getAllCommunities = factory.getAll(Community);
exports.getCommunity = factory.getOne(Community);
exports.createCommunity = factory.createOne(Community);
exports.updateCommunity = factory.updateOne(Community);
exports.deleteCommunity = factory.deleteOne(Community);
