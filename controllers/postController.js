const Community = require("./../models/communityModel");
const PostType = require("./../models/postTypeModel");
const Post = require("./../models/postModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

exports.setRelationIds = catchAsync(async (req, res, next) => {
  let x = {};
  req.body.about = {
    "@type": "Relation",
  };

  if (!req.body.user) {
    req.body.about = {
      ...req.body.about,
      creator: {
        "@type": "Person",
        value: req.user.id,
      },
    };
  }

  const communityId = req.params.communityId;
  const community = await Community.findById(communityId);
  if (community) {
    req.body.about = {
      ...req.body.about,
      community: {
        "@type": "Organization",
        value: req.params.communityId,
      },
    };
  } else {
    new AppError("Community not found!", 404);
  }

  const postTypeId = req.params.postTypeId;
  const postType = await PostType.findById(postTypeId);
  if (postType) {
    req.body.about = {
      ...req.body.about,
      postType: {
        "@type": "PostType",
        value: req.params.postTypeId,
      },
    };
  } else {
    new AppError("Post type not found!", 404);
  }

  next();
});

exports.getAllPosts = factory.getAll(Post);
exports.getPost = factory.getOne(Post);
exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
