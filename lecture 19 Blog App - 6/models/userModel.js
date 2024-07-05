const bcrypt = require("bcryptjs");
const userSchema = require("../schemas/userSchema");
const { ObjectId } = require("mongodb");

const User = class {
  constructor({ email, name, username, password }) {
    this.email = email;
    this.username = username;
    this.name = name;
    this.password = password;
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      try {
        //db to check if username and email exist or not
        const userExist = await userSchema.findOne({
          $or: [{ email: this.email }, { username: this.username }],
        });

        if (userExist && userExist.email === this.email)
          reject("Email already exist");
        if (userExist && userExist.username === this.username)
          reject("Username already exist");

        const hashedPassword = await bcrypt.hash(
          this.password,
          Number(process.env.SALT)
        );

        const userObj = new userSchema({
          name: this.name,
          email: this.email,
          password: hashedPassword,
          username: this.username,
        });

        const userDb = await userObj.save();
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserWithKey({ key }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!key) reject("key is missing");

        const userDb = await userSchema
          .findOne({
            $or: [
              ObjectId.isValid(key) ? { _id: key } : { username: key },
              { email: key },
            ],
          })
          .select("+password");

        if (!userDb) reject("User not found");

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;

// server ---> router ---> controller ---> model <---> DB

//controller (obj of User) <--------- model( obj of Schema ) <----------Schema (obj mongoose)
