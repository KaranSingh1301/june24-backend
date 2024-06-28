const express = require("express");
require("dotenv").config();
const clc = require("cli-color");
const db = require("./db");

//file-imports
const authRouter = require("./routers/authRouter");

const app = express();
const PORT = process.env.PORT;

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(clc.yellowBright.bold(`server is running on PORT:${PORT}`));
});
