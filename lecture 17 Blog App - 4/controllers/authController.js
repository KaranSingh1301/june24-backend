const bcrypt = require("bcryptjs");
const fs = require("fs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("../models/userModel");
const { userDataValidation } = require("../utils/authUtils");

const registerController = async (req, res) => {
  console.log(req.body);

  const { email, username, password, name } = req.body;

  //data validation
  try {
    await userDataValidation({ name, email, username, password });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data invalid",
      error: error,
    });
  }

  //store user data

  const obj = new User({ name, email, username, password });
  try {
    const userDb = await obj.registerUser();

    return res.send({
      status: 201,
      message: "User registered successfully",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const loginController = async (req, res) => {
  const { loginId, password } = req.body;
  console.log(req.body);
  if (!loginId || !password)
    return res.send({
      status: 400,
      message: "Missing user credentials",
    });

  //find the user
  try {
    const userDb = await User.findUserWithLoginId({ loginId });

    //compare the password
    const isMatch = await bcrypt.compare(password, userDb.password);

    if (!isMatch) {
      return res.send({
        status: 400,
        message: "Incorrect password",
      });
    }

    req.session.isAuth = true;
    req.session.user = {
      username: userDb.username,
      email: userDb.email,
      userId: userDb._id,
    };

    return res.send({
      status: 200,
      message: "login successfully",
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const logoutController = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send({
        status: 500,
        message: "Unable to logout",
      });
    }

    return res.send({
      status: 200,
      message: "logout successfull",
    });
  });
};

const loginPageController = (req, res) => {
  return res.render("loginForm");
};

const logoutAllDeviceController = async (req, res) => {
  const userId = req.session.user.userId;
  //create a session schema
  const sessionSchema = new Schema({ _id: String }, { strict: false });
  //convert into a model
  const sessionModel = mongoose.model("session", sessionSchema);
  //mongoose query to delete the entry

  try {
    const deleteDB = await sessionModel.deleteMany({
      "session.user.userId": userId,
    });

    return res.send({
      status: 200,
      message: `Logout from ${deleteDB.deletedCount} devices is successfull`,
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
  registerController,
  loginController,
  logoutController,
  logoutAllDeviceController,
  loginPageController,
};
