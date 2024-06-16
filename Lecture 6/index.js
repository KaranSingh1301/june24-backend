const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);
const userModel = require("./userSchema");

const app = express();
const PORT = 8000;
const MONGO_URI = `mongodb+srv://karan:12345@cluster0.22wn2.mongodb.net/juneTestDb`;
const store = new mongoDbSession({
  uri: MONGO_URI,
  collection: "sessions", //plural
});

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "This is june nodejs module",
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

// app.use(express.json())

//db connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Mongodb connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

//api
app.get("/", (req, res) => {
  return res.send("Server is running");
});

//register
app.get("/register-form", (req, res) => {
  return res.send(
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Register form</h1>

    <form action='/register' method='POST'>
        <label for="name">Name</label>
        <input type="text" name="name">
        <br/>
        <label for="email">Email</label>
        <input type="text" name="email">
        <br/>
        <label for="password">Password</label>
        <input type="text" name="password">
        <br/>
        <button type="submit">Submit</button>
    </form>
</body>
</html>`
  );
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  try {
    // //create
    // const userDb = await userModel.create({
    //   //I/0 bound
    //   //schema : client
    //   name: name,
    //   email,
    //   password: req.body.password,
    // });

    //save
    const userObj = new userModel({
      name,
      email,
      password,
      country: "USA",
    });

    const userDb = await userObj.save();

    return res.send({
      status: 201,
      message: "User created successfully",
      data: userDb,
    });
  } catch (error) {
    console.log(error);
    res.send({
      message: "Internal server error",
      error: error,
    });
  }
});

//login
app.get("/login-form", (req, res) => {
  return res.send(
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Login form</h1>

    <form action='/login' method='POST'>
        <label for="email">Email</label>
        <input type="text" name="email">
        <br/>
        <label for="password">Password</label>
        <input type="text" name="password">
        <br/>
        <button type="submit">Submit</button>
    </form>
</body>
</html>`
  );
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  //find the user using email

  try {
    const userDb = await userModel.findOne({ email: email });
    if (!userDb) {
      return res.status(400).json("email not found, please register first");
    }

    //compare the password
    if (password !== userDb.password) {
      return res.status(400).json("Incorrect password");
    }

    //session base auth
    console.log(req.session);
    req.session.isAuth = true;

    return res.status(200).json("login successfull");
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.get("/dashboard", (req, res) => {
  console.log(req.session);
  if (req.session.isAuth) {
    return res.send("Dashboard page data");
  } else {
    return res.send("Session expired, please login again");
  }
});

app.listen(PORT, () => {
  console.log(`server is running on PORT:${PORT}`);
});

//atlas configure
//link config
//mongoose install and connect
//schema
//model
//Query to save the data
