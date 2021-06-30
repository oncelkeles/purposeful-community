const express = require("express");

const invitationController = require("./../controllers/invitationController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    invitationController.createInvitation,
  )
  .get(
    authController.protect,
    invitationController.getInvitations
  );

router
.route("/:invitationId/accept")
.post(
  authController.protect,
  invitationController.acceptInvitation,
);

router
.route("/:invitationId/reject")
.post(
  authController.protect,
  invitationController.rejectInvitation,
);
module.exports = router;