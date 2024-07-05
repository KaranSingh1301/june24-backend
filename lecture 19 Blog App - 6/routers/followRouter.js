const express = require("express");
const {
  followUserController,
  getFollowingListController,
  getFollowerListController,
  unfollowController,
} = require("../controllers/followController");
const followRouter = express.Router();

followRouter.post("/follow-user", followUserController);
followRouter.get("/following-list", getFollowingListController);
followRouter.get("/follower-list", getFollowerListController);
followRouter.post("/unfollow-user", unfollowController);

module.exports = followRouter;
