const User = require("./../models/userModel");
const Community = require("./../models/communityModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
const PostType = require("../models/postTypeModel");
const Post = require("../models/postModel");

exports.setUserIds = (req, res, next) => {
  req.body = {
    ...req.body,
    "@context": "bunity/community.jsonld",
    "@type": "Community", // Organization
    ct: "bunity/community",
  };

  if (!req.body.user) {
    req.body = {
      ...req.body,
      creator: {
        "@type": "ct:creator",
        "@id": req.user.id,
      },
    };
  }
  next();
};

exports.updateCommunity = catchAsync(async (req, res, next) => {
  const doc = await Community.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.getAllPostTypes = catchAsync(async (req, res, next) => {
  const community = await Community.findById(req.params.communityId);

  const postTypes = await PostType.find({ '_id': { $in: community.communityDataTypes } })

  res.status(200).json({
    status: "success",
    data: {
      data: postTypes,
    },
  });
});

exports.getAllPosts= catchAsync(async (req, res, next) => {
  const community = await Community.findById(req.params.communityId);

  const posts = await Post.find({ '_id': { $in: community.posts } })

  res.status(200).json({
    status: "success",
    data: {
      data: posts,
    },
  });
});

exports.getAllCommunities = factory.getAll(Community);
exports.getCommunity = factory.getOne(Community);
exports.createCommunity = factory.createOne(Community);
exports.updateCommunity = factory.updateOne(Community);
exports.deleteCommunity = factory.deleteOne(Community);
