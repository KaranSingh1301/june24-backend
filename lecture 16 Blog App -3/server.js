const express = require("express");
require("dotenv").config();
const clc = require("cli-color");
const db = require("./db");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);

//file-imports
const authRouter = require("./routers/authRouter");
const blogRouter = require("./routers/blogRouter");
const isAuth = require("./middlewares/isAuthMiddleware");

const app = express();
const PORT = process.env.PORT;
const store = new mongodbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/auth", authRouter);
app.use("/blog", isAuth, blogRouter);

app.listen(PORT, () => {
  console.log(clc.yellowBright.bold(`server is running on PORT:${PORT}`));
});
