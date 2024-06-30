const bcrypt = require("bcryptjs");

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

  if (!loginId || !password)
    return res.send({
      status: 400,
      message: "Missing user credentials",
    });

  //find the user \
  try {
    const userDb = User.findUserWithLoginId({ loginId });

    //compare the password
    const isMatch = await bcrypt.compare(password, userDb.password);

    req.session.isAuth = true;
    req.session.user = {
      username: userDb.username,
      email: userDb.email,
      userId: userDb._id,
    };

    if (!isMatch) {
      return res.send({
        status: 400,
        message: "Incorrect password",
      });
    }
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }

  //session base

  return res.send("login api working controller");
};

module.exports = { registerController, loginController };
