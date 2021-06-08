const express = require("express");

const communityController = require("./../controllers/communityController");
const postTypeController = require("./../controllers/postTypeController");
const postController = require("./../controllers/postController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(communityController.getAllCommunities)
  .post(communityController.setUserIds, communityController.createCommunity);

router
  .route("/:communityId/postTypes")
  .post(postTypeController.setRelationIds, postTypeController.createPostType)
  .get(communityController.getAllPostTypes);

router
  .route("/:communityId/postTypes/:postTypeId/posts")
  .post(postController.setRelationIds, postController.createPost);

router
  .route("/:communityId/posts")
  .get(communityController.getAllPosts);

module.exports = router;
