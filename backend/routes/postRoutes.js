const express = require("express");

const postTypeController = require("./../controllers/postTypeController");
const postController = require("./../controllers/postController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

/* router.route("/:communityId").post(
  authController.protect,
  postTypeController.setRelationIds,
  postTypeController.createPostType
  //postTypeController.updateCommunityForNewPostType
); */

router.route("/").get(postController.searchPosts);

router.route("/:id").patch(postController.updatePost);

module.exports = router;
