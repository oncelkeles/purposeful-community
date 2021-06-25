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
        id: req.user.id,
        // user : req.user.id - TODO
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

  const postTypes = await PostType.find({
    _id: { $in: community.communityDataTypes },
  });

  res.status(200).json({
    status: "success",
    data: {
      data: postTypes,
    },
  });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const community = await Community.findById(req.params.communityId);

  const posts = await Post.find({ _id: { $in: community.posts } }).sort({
    updatedAt: -1,
  });

  /* res.status(200).json({
    status: "success",
    data: {
      data: posts,
    },
  }); */
  req.posts = posts;
  next();
});

exports.sendAllPosts = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      data: req.posts,
    },
  });
});

exports.searchCommunities = catchAsync(async (req, res, next) => {
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
  const docs = await Community.find({
    $or: [
      { name: { $regex: queryStr, $options: "i" } },
      { description: { $regex: queryStr, $options: "i" } },
      /* { "community.name": { $regex: queryStr, $options: "i" } },
      { "communityDataType.title": { $regex: queryStr, $options: "i" } }, */
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

exports.getMyCommunities = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  console.log(req.user);

  let docs;
  try {
    docs = await Community.find({
      $or: [
        { "creator.id": { $eq: userId } },
        { organizers: { $in: { id: userId } } },
        { members: { $in: userId } },
      ],
    });
  } catch (err) {
    console.log(err);
  }

  console.log(docs);

  res.status(200).json({
    status: "success",
    data: docs,
  });
});

exports.joinCommunity = catchAsync(async (req, res, next) => {
  const community = await Community.findById(req.params.communityId);
  let creator = community.creator.id;
  let organizers = community.organizers;
  if (creator == req.user.id || organizers.includes(req.user.id)) {
    return next(
      new AppError("The user is the creator or one of the organizers.", 400)
    );
  }
  let members = community.members;
  if (members.includes(req.user.id) == true) {
    return next(new AppError("The user is already a member!", 400));
  }
  if (organizers.includes(req.user.id)) {
    return next(
      new AppError("The user is the creator or one of the organizers.", 400)
    );
  }
  if (community.isPublic == true) {
    let members = community.members;
    if (members.includes(req.user.id) == false) {
      console.log("yayy");
      var comm = await Community.findByIdAndUpdate(
        community._id,
        { members: [...community.members, req.user.id] },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({
        status: "success",
        data: {
          data: comm,
        },
      });
    } else {
      return next(new AppError("The user is already a member.", 400));
    }
  } else {
    let requests = community.joinRequests;
    console.log(requests);
    if (requests.some((e) => e.user == req.user.id && e.status == 1)) {
      return next(new AppError("An invitation already exists!", 400));
    }
    var comm = await Community.findByIdAndUpdate(
      community._id,
      {
        joinRequests: [
          ...community.joinRequests,
          { user: req.user.id, status: 1 },
        ],
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        data: comm,
      },
    });
  }
});

exports.acceptCommunity = catchAsync(async (req, res, next) => {
  const community = await Community.findById(req.params.communityId);
  const creator = community.creator.id;
  var organizers = community.organizers;
  if (creator != req.user.id || organizers.some((e) => e.user == req.user.id)) {
    return next(new AppError("No permission allowed.", 405));
  }
  let requests = community.joinRequests;
  // console.log(requests);
  console.log(req.body);
  console.log(requests);
  var data = requests.find(function (ele) {
    return ele.user == req.body.userId;
  });
  console.log(data);
  if (requests.some((e) => e.user == req.body.userId && e.status == 1)) {
    const index = requests.findIndex((v) => v.user == req.body.userId);
    requests.splice(index, index >= 0 ? 1 : 0);
    console.log("yay1");
    console.log(index);
    var comm = await Community.findByIdAndUpdate(
      community._id,
      {
        members: [...community.members, req.body.userId],
        joinRequests: requests,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        data: comm,
      },
    });
  } else {
    return next(new AppError("Not Found.", 404));
  }
});

exports.rejectCommunity = catchAsync(async (req, res, next) => {
  const community = await Community.findById(req.params.communityId);
  const creator = community.creator.id;
  var organizers = community.organizers;
  if (creator != req.user.id || organizers.some((e) => e.user == req.user.id)) {
    return next(new AppError("No permission allowed.", 405));
  }
  let requests = community.joinRequests;
  if (requests.some((e) => e.user == req.body.userId && e.status == 1)) {
    const index = requests.findIndex((v) => v.user == req.body.userId);
    requests.splice(index, index >= 0 ? 1 : 0);
    var comm = await Community.findByIdAndUpdate(
      community._id,
      { joinRequests: requests },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        data: comm,
      },
    });
  } else {
    return next(new AppError("Not Found.", 404));
  }
});

exports.getAllCommunities = factory.getAll(Community);
exports.getCommunity = factory.getOne(Community);
exports.createCommunity = factory.createOne(Community);
exports.updateCommunity = factory.updateOne(Community);
exports.deleteCommunity = factory.deleteOne(Community);
