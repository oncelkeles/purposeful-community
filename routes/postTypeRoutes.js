const express = require("express");

const postTypeController = require("./../controllers/postTypeController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/:communityId")
  .post(
    authController.protect,
    postTypeController.setRelationIds,
    postTypeController.createPostType
  );

module.exports = router;
