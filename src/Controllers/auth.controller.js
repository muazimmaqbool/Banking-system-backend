const userModel = require("../Models/user.model");
const {
  jwtAuthMiddleware,
  generateToken,
} = require("../middleware/auth.middleware");
const emailService = require("../services/email");
const tokenBlackListModel = require("../Models/blackList.model");

//user register controller
//will be used with this api: /api/auth/register
//it's inside app.routes.js file

/**
 * - user register controller
 * - POST /api/auth/register
 */
async function userRegisterController(req, res) {
  const { email, password, name } = req.body;

  //checking whether email already exists or not
  const isExists = await userModel.findOne({
    email: email,
  });

  //returing if email already exists
  if (isExists) {
    return res.status(422).json({
      message: "Email already exists",
      status: "Failed",
    });
  }

  //if user is new/email is new
  const user = await userModel.create({
    email,
    password,
    name,
  });

  const payLoad = { userId: user._id };
  //returning jwt token
  const token = generateToken(payLoad);

  //now saving token in cookie
  res.cookie("token", token);

  //finall response after everything done
  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token: token,
  });

  //sending email
  await emailService.sendRegistrationEmail(user.name, user.email);
}

//controller for login user:
/**
 * - User Login Controller
 * - POST: /api/auth/login
 */
async function userLoginController(req, res) {
  const { email, password } = req.body;
  // console.log("email and password:",email,password)

  const user = await userModel.findOne({ email }).select("+password");
  //.select("+password"); why we used this, because in user.model.js we have set select:false for password
  //means password will not get returned that's why we select .select("+password"); so it gets returned for comparison

  //Note if we do this: ).select("password"); i.e not adding + prefix to password then only password is returned, no email and name
  // console.log("user:",user)

  //user is not found that's email not found in db
  if (!user) {
    return res.status(401).json({
      message: "Email is INVALID",
    });
  }

  //user email is found now comparing password
  const isValidPassword = await user.comparePassword(password);
  //comparePassword method is defined inside user.mode.js file

  if (!isValidPassword) {
    return res.status(401).json({
      message: "Password is INVALID",
    });
  }

  //user is valid
  const payLoad = { userId: user._id };
  const token = generateToken(payLoad);
  res.cookie("token", token);

  res.status(200).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
  });
}

//controller for logout
/**
 * - User Logout Controller
 * - POST /api/auth/logout
 */
async function userLogoutController(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(200).json({
      message: "User log out successfully",
    });
  }
  //or
  //   if(!token){
  //   return res.status(400).json({
  //     message:"Token is missing"
  //   })
  // }

  //adding token to black list so this token won't be used again i.e for hacking/unauthorized
  await tokenBlackListModel.create({
    token: token,
  });

  res.clearCookie("token");

  res.status(200).json({
    message: "User logged out successfully",
  });
}

module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController,
};
