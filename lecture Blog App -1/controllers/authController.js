const { userDataValidation } = require("../utils/authUtils");

const registerController = async (req, res) => {
  console.log("register working");

  const { name, email, username, password } = req.body;

  //data validation

  try {
    await userDataValidation({ name, email, username, password });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data invalid",
      error: error,
    });
  }

  return res.send("register api working controller");
};

const loginController = (req, res) => {
  console.log("login working");
  return res.send("login api working controller");
};

module.exports = { registerController, loginController };
