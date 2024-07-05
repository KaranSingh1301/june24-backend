const { LIMIT } = require("../privateConstants");
const blogSchema = require("../schemas/blogSchema");

const createBlog = ({ title, textBody, userId }) => {
  return new Promise(async (resolve, reject) => {
    const blogObj = new blogSchema({
      title: title,
      textBody: textBody,
      userId: userId,
      creationDateTime: Date.now(),
    });
    console.log(blogObj);

    try {
      const blogDb = await blogObj.save();
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getAllBlogs = ({ SKIP }) => {
  return new Promise(async (resolve, reject) => {
    //aggregate -> pagination (skip, limit), sort
    try {
      const blogdb = await blogSchema.aggregate([
        {
          $match: { isDeleted: { $ne: true } },
        },
        {
          $sort: { creationDateTime: -1 }, //-1 DESC, 1 ASCD
        },
        {
          $skip: SKIP,
        },
        {
          $limit: LIMIT,
        },
      ]);
      resolve(blogdb);
    } catch (error) {
      reject(error);
    }
  });
};

const getMyBlogs = ({ userId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    //match, sort, pagination
    console.log(userId);
    try {
      const blogsDb = await blogSchema.aggregate([
        {
          $match: { userId: userId, isDeleted: { $ne: true } },
        },
        {
          $sort: { creationDateTime: -1 },
        },
        {
          $skip: SKIP,
        },
        {
          $limit: LIMIT,
        },
      ]);

      resolve(blogsDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getBlogWithId = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!blogId) reject("missing blogId");

      const blogDb = await blogSchema.findOne({ _id: blogId });

      if (!blogDb) reject(`Blog not found with blogId : ${blogId}`);

      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const editBlog = ({ title, textBody, blogId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogPrevDb = await blogSchema.findOneAndUpdate(
        { _id: blogId },
        { title: title, textBody: textBody }
      );

      resolve(blogPrevDb);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteBlog = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const blogPrevDb = await blogSchema.findOneAndDelete({ _id: blogId });

      const blogPrevDb = await blogSchema.findOneAndUpdate(
        { _id: blogId },
        { isDeleted: true, deletionDateTime: Date.now() }
      );

      resolve(blogPrevDb);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getBlogWithId,
  editBlog,
  deleteBlog,
};
