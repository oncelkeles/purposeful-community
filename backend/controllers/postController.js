const mongoose = require("mongoose");

const APIFeatures = require("./../utils/apiFeatures");
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
        id: req.user.id,
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
        name: community.name,
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
        title: postType.title,
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

  console.log("POSTS:", doc);
  console.log("COMM:", comm);

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

exports.getPostsFromPostType = catchAsync(async (req, res, next) => {
  const communityId = req.params.communityId;
  const postTypeId = req.params.postTypeId;

  /* const post = await Post.find({ _id: { $in: community.posts } }).sort({
    createdAt: -1,
  }); */
  const posts = req.posts;
  //console.log(posts);
  let id = "";
  let postsToSend = [];

  posts.map((post, index) => {
    let check = true;
    //console.log(post.communityDataType);
    Object.values(post.communityDataType).map((item) => {
      console.log(item);
      if (
        item &&
        item.length > 20 &&
        item.substring(0, 24) === "bunity/communityDataType"
      ) {
        console.log(item.substring(25));
        if (item.substring(25) !== postTypeId) {
          check = false;
        }
      }
    });
    if (check) {
      postsToSend.push({
        title: post.title,
        id: post._id,
        label: post.title,
        value: post._id,
      });
    }
  });

  console.log(postsToSend);

  res.status(201).json({
    status: "success",
    data: postsToSend,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  console.log("HEY");
  console.log(req.params.postId);
  let doc = await Post.findById(req.params.postId);
  console.log(doc);
  /* if (popOptions) {
    query = query.populate(popOptions);
  }
  const doc = await query; */

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.searchPosts = catchAsync(async (req, res, next) => {
  /* const features = new APIFeatures(Post.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  console.log(features.query) */

  const queryObj = { ...req.query };

  //{ $regex: "s", $options: "i" } }
  // 1.b) advanced filtering
  let queryString = JSON.stringify(queryObj);
  console.log(queryString);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );

  console.log(Object.values(queryObj));
  const queryStr = Object.values(queryObj)[0];

  //const docs = await Post.find({ "title": { "$regex": queryStr, "$options": "i" } })
  const docs = await Post.find({
    $or: [
      { title: { $regex: queryStr, $options: "i" } },
      { description: { $regex: queryStr, $options: "i" } },
      { "community.name": { $regex: queryStr, $options: "i" } },
      { "communityDataType.title": { $regex: queryStr, $options: "i" } },
    ],
  });

  /*  const docs = await Post.find().and([
    { $or: [{a: 1}, {b: 1}] },
    { $or: [{c: 1}, {d: 1}] }
]) */
  console.log("docs: ", docs);

  res.status(200).json({
    status: "success",
    data: docs,
  });
});

exports.getAllPosts = factory.getAll(Post);
//exports.getPost = factory.getOne(Post);
//exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
