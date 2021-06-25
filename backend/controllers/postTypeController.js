const mongoose = require("mongoose");

const Community = require("./../models/communityModel");
const PostType = require("./../models/postTypeModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

exports.setRelationIds = catchAsync(async (req, res, next) => {
  let myId = mongoose.Types.ObjectId();

  req.body = {
    ...req.body,
    "@context": "bunity/communityDataType.jsonld",
    "@type": "CommunityDataType", // Organization
    "@id": `bunity/communityDataType/${myId}`,
    cdt: "bunity/CommunityDataType",
    _id: myId,
  };

  if (!req.body.user) {
    req.body = {
      ...req.body,
      creator: {
        "@type": "ct:creator",
        "@id": req.user.id,
        id: req.user.id,
      },
    };
  }

  const communityId = req.params.communityId;
  const community = await Community.findById(communityId);
  req.community = community;

  next();
});

exports.createPostType = catchAsync(async (req, res, next) => {
  let doc;
  try {
    doc = await PostType.create(req.body);
  } catch (err) {
    console.log(err);
  }

  console.log("comm", doc);
  req.postType = doc;

  const comm = req.community;

  await Community.findByIdAndUpdate(
    comm.id,
    { communityDataTypes: [...comm.communityDataTypes, req.postType._id] },
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
});

exports.updateCommunityForNewPostType = catchAsync(async (req, res, next) => {
  const comm = req.community;
  const postType = req.postType;

  doc = await Community.findByIdAndUpdate(
    comm.id,
    { communityDataTypes: [...comm.communityDataTypes, postType._id] },
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
});

exports.getAllPostTypes = factory.getAll(PostType);
exports.getPostType = factory.getOne(PostType);
//exports.createPostType = factory.createOne(PostType);
exports.updatePostType = factory.updateOne(PostType);
exports.deletePostType = factory.deleteOne(PostType);
