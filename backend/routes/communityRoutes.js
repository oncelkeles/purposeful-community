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

router.route("/:communityId/join").post(communityController.joinCommunity);
router.route("/:communityId/accept").post(communityController.acceptCommunity);
router.route("/:communityId/reject").post(communityController.rejectCommunity);

router
  .route("/:communityId/postTypes")
  .post(postTypeController.setRelationIds, postTypeController.createPostType)
  .get(communityController.getAllPostTypes);

router
  .route("/:communityId/postTypes/:postTypeId/posts")
  .post(postController.setRelationIds, postController.createPost)
  .get(communityController.getAllPosts, postController.getPostsFromPostType);

router
  .route("/:communityId/posts")
  .get(communityController.getAllPosts, communityController.sendAllPosts);

router.route("/:communityId/posts/:postId").get(postController.getPost);

router.route("/search").get(communityController.searchCommunities);

router.route("/me").get(communityController.getMyCommunities);

module.exports = router;
