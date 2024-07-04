const blogDataValidator = require("../utils/blogUtils");
const {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getBlogWithId,
  editBlog,
  deleteBlog,
} = require("../models/blogModel");

const createBlogController = async (req, res) => {
  console.log(req.body);

  const { title, textBody } = req.body;
  const userId = req.session.user.userId;

  //data validation
  try {
    await blogDataValidator({ title, textBody });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid blog data",
      error: error,
    });
  }

  try {
    const blogDb = await createBlog({ title, textBody, userId });

    return res.send({
      status: 201,
      message: "Blog created successfully",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const getBlogsController = async (req, res) => {
  const SKIP = parseInt(req.query.skip) || 0;

  //call a function
  try {
    const blogsDb = await getAllBlogs({ SKIP });

    if (blogsDb.length === 0) {
      return res.send({
        status: 204,
        message: "No more blogs",
      });
    }

    return res.send({
      status: 200,
      message: "Read success",
      data: blogsDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const getMyBlogsController = async (req, res) => {
  console.log(req.session);

  const userId = req.session.user.userId;
  const SKIP = Number(req.query.skip) || 0;

  try {
    const blogDb = await getMyBlogs({ userId, SKIP });
    console.log(blogDb);

    if (blogDb.length === 0) {
      return res.send({
        status: 204,
        message: "No more blogs",
      });
    }

    return res.send({
      status: 200,
      message: "Read success",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const editBlogController = async (req, res) => {
  const { title, textBody, blogId } = req.body;
  const userId = req.session.user.userId;

  try {
    await blogDataValidator({ title, textBody });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid data",
      error: error,
    });
  }

  try {
    const blogDb = await getBlogWithId({ blogId });

    // console.log(userId.toString() === blogDb.userId.toString());

    if (!userId.equals(blogDb.userId)) {
      return res.send({
        status: 403,
        message: "Not allowed to edit the blog",
      });
    }

    const diff = (Date.now() - blogDb.creationDateTime) / (1000 * 60);

    if (diff > 30) {
      return res.send({
        status: 400,
        message: "Not able to edit after 30 mins of creation.",
      });
    }

    const blogPrevDb = await editBlog({ title, textBody, blogId });

    return res.send({
      status: 200,
      message: "blog updated successfully",
      data: blogPrevDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const deleteBlogController = async (req, res) => {
  const { blogId } = req.body;
  const userId = req.session.user.userId;

  try {
    const blogDb = await getBlogWithId({ blogId });

    if (!userId.equals(blogDb.userId)) {
      return res.send({
        status: 403,
        message: "Not allowed to delete the blog",
      });
    }

    const blogPrevDb = await deleteBlog({ blogId });

    return res.send({
      status: 200,
      message: "blog deleted successfully",
      data: blogPrevDb,
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

module.exports = {
  createBlogController,
  getBlogsController,
  getMyBlogsController,
  editBlogController,
  deleteBlogController,
};
