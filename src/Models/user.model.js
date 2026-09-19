const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required for creating a user"], // this messge will be send when email is not provided
      trim: true,
      lowercase: true,
      unique: [true, "Email already exists"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address",
      ],
      //regex i have copied from google just search email regex
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password should contain more than 6 characters"],
      select: false, //with select=false, whenever we fetch user data by any user query the password will not be returned by default
    },
  },
  {
    timestamps: true, // this will track when was user created and when was last time user data was updated
  },
);

//this will be called just before saving user
userSchema.pre("save", async function (next) {
  //checking if password is modified or not and if not modified then saving without hashing password
  if (!this.isModified("password")) {
    return next();
  }

  //if password is changed or new password added hasing the password before saving it using bcrypt library
  const hash = await bcrypt.hash(this.password, 10); // 10 is salt of size 10
  this.password = hash;
  //we converted password to hash and then saved hash in password
  return next();
  //or
  /*
  try {

    //1: generating salt (here genSalt(10) means 10 round salt, generates random string)
    const salt = await bycrypt.genSalt(10); // we can also do this: const salt="this is a salt"; but not secure at all
    //console.log("salt:",salt) // $2b$10$UjvORRbdKDQVh3aXB3f6wO

    //2: hashing password
    const hashedPassword = await bycrypt.hash(user.password, salt);

    //3: overrides the plan password with the hashed one
    user.password = hashedPassword;

    next(); //means we have done processing now you can save in db/do further tasks
  } catch (err) {
    return next(err);
  }
  */

  //method comparePassword used to compare password entered by the user with the hashed password in db
  userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
      // console.log("candidatePassword:",candidatePassword)
      //using bycrypt to compare provided password with hashed password
      const isMatch = await bycrypt.compare(candidatePassword, this.password);
      return isMatch;
    } catch (err) {
      throw err;
    }
  };
  const User = mongoose.model("User", userSchema);
  module.exports = User;
});
