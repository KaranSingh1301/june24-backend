const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function isValidPassword(password) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

const userDataValidation = ({ name, email, username, password }) => {
  return new Promise((resolve, reject) => {
    if (!email || !username || !password) reject("Missing user data");

    if (typeof email !== "string") reject("email is not a text.");
    if (typeof username !== "string") reject("username is not a text.");
    if (typeof password !== "string") reject("password is not a text.");

    if (!validateEmail(email)) reject("Email format is incorrect");

    // if (!isValidPassword(password)) reject("password is not alpha-numeric");

    resolve();
  });
};

module.exports = { userDataValidation };
