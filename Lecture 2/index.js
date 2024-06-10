//ES5
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  return res.send("Sersver is running");
});

//Query
app.get("/test", (req, res) => {
  console.log(req);
  return res.send("api is working fine");
  // return res.json("working fine with json resposssssne");
  // return res.status(202).json("working fine");
});

// ?key=val
app.get("/api", (req, res) => {
  console.log(req.query);
  const key = req.query.key;
  return res.send("api is working fine");
});

// ?key1=val1&key2=val2
app.get("/api1", (req, res) => {
  console.log(req.query);
  const key1 = req.query.key1;
  const key2 = req.query.key2;

  // const {key1, key2} = req.query

  return res.send(`Queries values key1: ${key1} and key2 :${key2}`);
});

// ?key=val1,val2
app.get("/api2", (req, res) => {
  console.log(req.query.key.split(","));
  const key = req.query.key.split(",");
  return res.send(`Queries values key1: ${key[0]} and key2 : ${key[1]}`);
});

//params

app.get("/profile/:name", (req, res) => {
  console.log(req.params);
  return res.send("all ok");
});

// app.get("/profile/:id1/:id2", (req, res) => {
//   console.log(req.params);
//   return res.send("all ok");
// });

app.get("/profile/:id/data", (req, res) => {
  console.log(req.params);
  return res.send("all ok");
});

app.listen(8000, () => {
  console.log("server is running on PORT:8000");
});
