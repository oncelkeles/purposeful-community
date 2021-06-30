const express = require("express");

const postTypeController = require("./../controllers/postTypeController");
const communityController = require("./../controllers/communityController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/:communityId").post(
  authController.protect,
  postTypeController.setRelationIds,
  postTypeController.createPostType
  //postTypeController.updateCommunityForNewPostType
);

router.route("/:id").get(postTypeController.getPostType);

module.exports = router;
