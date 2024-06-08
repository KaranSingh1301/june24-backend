//ES5
const express = require("express");

const app = express();

app.get("/home", (req, res) => {
  console.log("home api is working");
  return res.send("Server is running");
});

app.listen(8000, () => {
  console.log("server is running on PORT:8000");
});
