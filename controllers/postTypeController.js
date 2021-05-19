const Community = require("./../models/communityModel");
const PostType = require("./../models/postTypeModel");
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
  /* req.body.about = {
      "@type": "Person",
      value: req.user.id,
    }; */

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

  next();
});

exports.getAllPostTypes = factory.getAll(PostType);
exports.getPostType = factory.getOne(PostType);
exports.createPostType = factory.createOne(PostType);
exports.updatePostType = factory.updateOne(PostType);
exports.deletePostType = factory.deleteOne(PostType);
