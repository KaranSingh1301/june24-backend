const express = require("express");
const isAuth = require("../middlewares/isAuthMiddleware");
const {
  registerController,
  loginController,
  logoutController,
  logoutAllDeviceController,
  loginPageController,
} = require("../controllers/authController");

const authRouter = express.Router();

authRouter
  .get("/login", loginPageController)
  .post("/register", registerController)
  .post("/login", loginController)
  .post("/logout", isAuth, logoutController)
  .post("/logout_all_device", isAuth, logoutAllDeviceController);

module.exports = authRouter;
