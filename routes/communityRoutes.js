const express = require("express");

const communityController = require("./../controllers/communityController");
const postTypeController = require("./../controllers/postTypeController");
const postController = require("./../controllers/postController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(communityController.getAllCommunities)
  .post(
    authController.protect,
    communityController.setUserIds,
    communityController.createCommunity
  );

router
  .route("/:communityId/postType")
  .post(
    authController.protect,
    postTypeController.setRelationIds,
    postTypeController.createPostType
  );

router
  .route("/:communityId/postType/:postTypeId/post")
  .post(
    authController.protect,
    postController.setRelationIds,
    postController.createPost
  );

module.exports = router;
