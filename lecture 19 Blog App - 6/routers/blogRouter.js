const express = require("express");
const {
  createBlogController,
  getBlogsController,
  getMyBlogsController,
  editBlogController,
  deleteBlogController,
} = require("../controllers/blogController");

const blogRouter = express.Router();

blogRouter
  .post("/create-blog", createBlogController)
  .get("/get-blogs", getBlogsController)
  .get("/get-myblogs", getMyBlogsController)
  .post("/edit-blog", editBlogController)
  .post("/delete-blog", deleteBlogController);

module.exports = blogRouter;
