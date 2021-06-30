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

  req.postTypes = postTypes;

  next();

  /* res.status(200).json({
    status: "success",
    data: {
      data: postTypes,
    },
  }); */
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const community = await Community.findById(req.params.communityId);

  const posts = await Post.find({ _id: { $in: community.posts } }).sort({
    updatedAt: -1,
  });
  console.log(posts)
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
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );

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

  res.status(200).json({
    status: "success",
    data: docs,
  });
});

exports.getMyCommunities = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

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
          community: comm,
          joinSuccess: true,
        },
      });
    } else {
      return next(new AppError("The user is already a member.", 400));
    }
  } else {
    let requests = community.joinRequests;
    if (requests.some((e) => e.user == req.user.id && e.status == 1)) {
      return next(new AppError("An invitation already exists!", 400));
    }
    let user = await User.findById(req.user.id);
    var comm = await Community.findByIdAndUpdate(
      community._id,
      {
        joinRequests: [
          ...community.joinRequests,
          { user: req.user.id, status: 1, userName: user.name },
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
        community: comm,
        joinSuccess: false,
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
  var data = requests.find(function (ele) {
    return ele.user == req.body.userId;
  });
  if (requests.some((e) => e.user == req.body.userId && e.status == 1)) {
    const index = requests.findIndex((v) => v.user == req.body.userId);
    requests.splice(index, index >= 0 ? 1 : 0);
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

const checkFieldValue = (field, searchValue) => {
  let check = true;

  // console.log("FIELD",field)
  // console.log("value",searchValue.value)
  if (searchValue.value !== "" && searchValue.value !== null) {
    /* console.log("searchValue",searchValue)
    console.log("field",field) */
    if (field.dataType === "Select") {
      if (field.value !== searchValue.value) {
        check = false;
      }
    } else if (field.dataType === "Text" || field.dataType === "Number") {
      console.log("searchValue", searchValue);
      if (
        !field.value.toLowerCase().includes(searchValue.value.toLowerCase())
      ) {
        check = false;
      }
    } else if (field.dataType === "Checkbox") {
      if (field.value !== searchValue.value) {
        check = false;
      }
    } else {
    }
  }

  return check;
};

exports.advancedSearch = catchAsync(async (req, res, next) => {
  /* console.log(req.postsToSend.fields)
  req.postsToSend.fields.map(el => {
    console.log(el)
  }) */

  const searchInputs = req.body;
  let searchResults = [];

  //console.log(searchInputs)

  for (let i = 0; i < req.postsToSend.length; i++) {
    let check = true;
    let item = req.postsToSend[i];
    let startIndex = 0;
    let endIndex = 0;
    for (
      let searchIndex = 0;
      searchIndex < item.post.postFields.length;
      searchIndex++
    ) {
      let searchEl = item.post.postFields[searchIndex];
      console.log("searchInputs[endIndex]", searchInputs[endIndex]);
      //console.log("searchInputs[endIndex]",searchInputs[endIndex])

      if (item.post.postFields[searchIndex].dataType.id) {
        let tempDoc = await Post.findById(
          item.post.postFields[searchIndex].value.id
        );
        startIndex = endIndex;
        endIndex += tempDoc.postFields.length;
        let checkTemp = true;
        tempDoc.postFields.map((elem, indexTemp) => {
          const a = checkFieldValue(elem, searchInputs[startIndex + indexTemp]);
          !a ? (checkTemp = false) : null;
        });

        if (!checkTemp) check = false;
      } else {
        if (
          searchInputs[endIndex].value !== "" &&
          searchInputs[endIndex].value !== null
        ) {
          if (item.post.postFields[searchIndex].dataType === "Select") {
            console.log("elem", item.post.postFields[searchIndex]);
            console.log(
              "item.post.postFields[searchIndex].value",
              item.post.postFields[searchIndex]
            );
            console.log("searchInputs[endIndex].value", searchInputs[endIndex]);
            console.log(".............................");
            if (
              item.post.postFields[searchIndex].value !==
              searchInputs[endIndex].value
            ) {
              check = false;
            }
          } else if (
            item.post.postFields[searchIndex].dataType === "Text" ||
            item.post.postFields[searchIndex].dataType === "Number"
          ) {
            if (
              !item.post.postFields[searchIndex].value
                .toLowerCase()
                .includes(searchInputs[endIndex].value.toLowerCase())
            ) {
              check = false;
            }
          } else if (
            item.post.postFields[searchIndex].dataType === "Checkbox"
          ) {
            /* console.log("HEEYY searchInputs", searchInputs[endIndex]);
              console.log(
                "HEEYY CHECKBOOX 1111",
                item.post.postFields[searchIndex].value
              );
              console.log("HEEYY CHECKBOOX 2222", searchEl.value); */
            if (
              item.post.postFields[searchIndex].value !==
              searchInputs[endIndex].value
            ) {
              check = false;
            }
          }
        }
        endIndex++;
      }
    }
    console.log("check", check);
    let finalCheck = true;
    /* result2.map((e) => {
      !e ? (finalCheck = false) : null;
    }); */
    //console.log("finalCheck", finalCheck);
    if (check) {
      searchResults.push(item);
    }
  }

  // post olmadığı için girmiyor

  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

  res.status(200).json({
    status: "success",
    data: { results: searchResults, total: req.postsToSend.length },
  });
});

exports.sendPostTypes = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      data: req.postTypes,
    },
  });
});

exports.searchPostTypes = catchAsync(async (req, res, next) => {
  const postTypes = req.postTypes;
  const searchString = req.body.text;

  let dataTypesToReturn = [];
  postTypes.map((item) => {
    if (
      item.title.toLowerCase().includes(searchString.toLowerCase()) ||
      item.description.toLowerCase().includes(searchString.toLowerCase())
    ) {
      dataTypesToReturn.push(item);
    }
  });

  res.status(200).json({
    status: "success",
    data: dataTypesToReturn,
  });
});

exports.getAllCommunities = factory.getAll(Community);
exports.getCommunity = factory.getOne(Community);
exports.createCommunity = factory.createOne(Community);
exports.updateCommunity = factory.updateOne(Community);
exports.deleteCommunity = factory.deleteOne(Community);
