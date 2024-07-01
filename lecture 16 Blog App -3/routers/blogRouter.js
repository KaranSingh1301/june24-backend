const express = require("express");
const { createBlogController } = require("../controllers/blogController");

const blogRouter = express.Router();

blogRouter.post("/create-blog", createBlogController);

module.exports = blogRouter;
