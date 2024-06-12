const express = require("express");

const app = express();
const PORT = 8000;

//middleware
app.use(express.urlencoded({ extended: true }));

// app.use(express.json())

//api
app.get("/", (req, res) => {
  return res.send("Server is running");
});

app.get("/user-form", (req, res) => {
  return res.send(
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>User form</h1>

    <form action='/form-submit' method='POST'>
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

app.post("/form-submit", (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  return res.send("Form submitted successfully");
});

app.listen(PORT, () => {
  console.log(`server us running on PORT:${PORT}`);
});
