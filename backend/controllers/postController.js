const mongoose = require("mongoose");

const Community = require("./../models/communityModel");
const PostType = require("./../models/postTypeModel");
const Post = require("./../models/postModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

exports.setRelationIds = catchAsync(async (req, res, next) => {
  let myId = mongoose.Types.ObjectId();

  req.body = {
    ...req.body,
    "@context": "bunity/communityData.jsonld",
    "@type": "CommunityData", // Organization
    "@id": `bunity/communityData/${myId}`,
    cd: "bunity/CommunityData",
    _id: myId,
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

  const communityId = req.params.communityId;
  const community = await Community.findById(communityId);
  req.community = community;

  if (community) {
    req.body = {
      ...req.body,
      community: {
        "@type": "cd:creator",
        "@id": `bunity/community/${req.params.communityId}`,
      },
    };
  } else {
    new AppError("Community not found!", 404);
  }

  const postTypeId = req.params.postTypeId;
  const postType = await PostType.findById(postTypeId);
  req.postType = postType;

  if (postType) {
    req.body = {
      ...req.body,
      communityDataType: {
        "@type": "cd:communityDataType",
        "@id": `bunity/communityDataType/${postTypeId}`,
      },
    };
  } else {
    new AppError("Community data type not found!", 404);
  }

  next();
});


exports.createPost = catchAsync(async (req, res, next) => {
  const doc = await Post.create(req.body);

  const comm = req.community;

  console.log("POSTS:" , doc)
  console.log("COMM:" , comm)

  await Community.findByIdAndUpdate(
    comm.id,
    { posts: [...comm.posts, doc._id] },
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

exports.getAllPosts = factory.getAll(Post);
exports.getPost = factory.getOne(Post);
//exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
