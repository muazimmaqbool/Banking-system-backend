const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

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
      //Note: regex i have copied from google just search email regex
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password should contain more than 6 characters"],
      select: false, //with select:false, whenever we fetch user data by any user query the password will not be returned by default
    },
    //systemUser is used to determine whether this account/user is owned by bank
    //if systemUser is true then it's banks own account which can be used to transfer any/initial amount of money
    //as banks have the money in form of cash
    systemUser:{
      type:Boolean,
      default:false,
      immutable:true,
      select:false
    }
  },
  {
    timestamps: true, // this will track when was user created and when was last time user data was updated
  },
);

//this will be called just before saving user (it's also an middle ware)
userSchema.pre("save", async function () {
  //checking if password is modified or not and if not modified then saving without hashing password
  if (!this.isModified("password")) {
    return
  }

  //if password is changed or new password added hasing the password before saving it using bcrypt library
  const hash = await bcrypt.hash(this.password, 10); // 10 is salt of size 10
  this.password = hash;
  //we converted password to hash and then saved hash in password
  return
  
});

 //method comparePassword used to compare password entered by the user with the hashed password in db
  userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
     // console.log("candidatePassword:",candidatePassword)
     // console.log("this.password:",this.password)
      
     //using bcrypt to compare provided password with hashed password
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
    } catch (err) {
      throw err;
    }
  };


  
  const userModel= mongoose.model("user", userSchema);
  module.exports =userModel;