const { LIMIT } = require("../privateConstants");
const followSchema = require("../schemas/followSchema");

const followUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    const followObj = new followSchema({
      followerUserId: followerUserId,
      followingUserId: followingUserId,
    });
    try {
      const followDb = await followObj.save();
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getFollowingList = ({ followerUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followDb = await followSchema
        .find({
          followerUserId: followerUserId,
        })
        .populate("followingUserId");

      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { followUser, getFollowingList };
