const express = require("express");
require("dotenv").config();
const clc = require("cli-color");
const mongoose = require("mongoose");

//file-imports

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

app.get("/", (req, res) => {
  return res.send("Server is running");
});

app.get("/register", (req, res) => {
  return res.render("registerPage");
});

app.get("/login", (req, res) => {
  return res.render("loginPage");
});

app.listen(PORT, () => {
  console.log(clc.yellowBright.bold(`server is running at:`));
  console.log(clc.yellowBright.underline(`http://localhost:${PORT}/`));
});
