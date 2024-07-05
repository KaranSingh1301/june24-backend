const {
  followUser,
  getFollowingList,
  getFollowerList,
  unfollow,
} = require("../models/followModel");
const User = require("../models/userModel");

const followUserController = async (req, res) => {
  const followingUserId = req.body.followingUserId; //userB
  const followerUserId = req.session.user.userId; //userA

  try {
    await User.findUserWithKey({ key: followingUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "following user not found",
      error: error,
    });
  }

  try {
    await User.findUserWithKey({ key: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "follower user not found",
      error: error,
    });
  }

  try {
    const followDb = await followUser({ followerUserId, followingUserId });

    return res.send({
      status: 201,
      message: "Follow successfull",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const getFollowingListController = async (req, res) => {
  const followerUserId = req.session.user.userId;
  const SKIP = Number(req.query.skip) || 0;

  try {
    const followingListDb = await getFollowingList({ followerUserId, SKIP });

    return res.send({
      status: 200,
      message: "Read success!",
      data: followingListDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const getFollowerListController = async (req, res) => {
  const followingUserId = req.session.user.userId;
  const SKIP = Number(req.query.skip) || 0;

  try {
    const followerListDb = await getFollowerList({ followingUserId, SKIP });

    return res.send({
      status: 200,
      message: "Read success!",
      data: followerListDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const unfollowController = async (req, res) => {
  const followingUserId = req.body.followingUserId; //userB
  const followerUserId = req.session.user.userId; //userA

  try {
    const deleteDb = await unfollow({ followerUserId, followingUserId });

    return res.send({
      status: 200,
      message: "Unfollow successfull",
      data: deleteDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = {
  followUserController,
  getFollowingListController,
  getFollowerListController,
  unfollowController,
};

//test-->test1
//test --->test2
//test-->test3
//test --->test4
//test-->test5
