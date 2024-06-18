const express = require("express");
require("dotenv").config();
const clc = require("cli-color");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//file-imports
const { userDataValidation, isEmailRgex } = require("./utils/authUtils");
const userModel = require("./models/userModel");

//constants
const app = express();
const PORT = process.env.PORT;

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(clc.yellowBright.bold("mongodb connected successfully"));
  })
  .catch((err) => console.log(clc.redBright(err)));

//middlewares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); //body parser url encoded
app.use(express.json()); //body parser json

app.get("/", (req, res) => {
  return res.send("Server is running");
});

app.get("/register", (req, res) => {
  return res.render("registerPage");
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, email, username, password } = req.body;

  //data validation
  try {
    await userDataValidation({ email, username, name, password });
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
    //email and username should be unique
    const userEmailExist = await userModel.findOne({ email: email });
    if (userEmailExist) {
      return res.status(400).json("Email already exist");
    }

    const userUsernameExist = await userModel.findOne({ username: username });
    if (userUsernameExist) {
      return res.status(400).json("Username already exist");
    }

    //encrypt the password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT)
    );

    //store with in db

    const userObj = new userModel({
      name,
      email,
      username,
      password: hashedPassword,
    });
    //  const userDb = await userModel.create({name, email, username, password});

    const userDb = await userObj.save();
    return res.status(201).json({
      message: "User register successfully",
      data: userDb,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
});

app.get("/login", (req, res) => {
  return res.render("loginPage");
});

app.post("/login", async (req, res) => {
  const { loginId, password } = req.body;
  if (!loginId || !password) {
    return res.status(400).json("Missing login credentials");
  }

  if (typeof loginId !== "string")
    return res.status(400).json("loginId is not a string");

  if (typeof password !== "string")
    return res.status(400).json("password is not a string");

  //find the user from db

  try {
    let userDb = {};
    if (isEmailRgex({ key: loginId })) {
      userDb = await userModel.findOne({ email: loginId });
    } else {
      userDb = await userModel.findOne({ username: loginId });
    }

    if (!userDb)
      return res.status(400).json("user not found, please register first");

    //compare the password

    const isMatched = await bcrypt.compare(password, userDb.password);

    console.log(isMatched);
    if (!isMatched) return res.status(400).json("Incorrect password");

    return res.status(200).json("login successfull");
  } catch (error) {
    return res.status(500).json(console.error());
  }

  //session base auth
});

app.listen(PORT, () => {
  console.log(clc.yellowBright.bold(`server is running at:`));
  console.log(clc.yellowBright.underline(`http://localhost:${PORT}/`));
});
