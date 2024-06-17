const express = require("express");
require("dotenv").config();
const clc = require("cli-color");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//file-imports
const { userDataValidation } = require("./utils/authUtils");
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

  //email and username should be unique

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
  try {
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

app.listen(PORT, () => {
  console.log(clc.yellowBright.bold(`server is running at:`));
  console.log(clc.yellowBright.underline(`http://localhost:${PORT}/`));
});
