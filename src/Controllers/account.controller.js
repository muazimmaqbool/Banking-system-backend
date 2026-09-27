const accountModel = require("../Models/account.model");

//this controller will create an account linked with the user id
async function createAccountController(req, res) {
  const user = req.user; // user details come inside req.user via token (i.e via jwtAuthMiddleware)

  //creating new account
  const newAccount = await accountModel.create({
    user: user._id,
  });

  res.status(201).json({ newAccount });
}

module.exports = { createAccountController };
