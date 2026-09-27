const accountModel = require("../Models/account.model");

//this controller will create an account linked with the user id
async function createAccountController(req, res) {
  const user = req.user; // user details come inside req.user via token (i.e via jwtAuthMiddleware)
 //console.log("User:",user)
 
  //creating new account
  const newAccount = await accountModel.create({
    user: user._id,
  });
  res.status(201).json({ newAccount });
/*
  o/p:
  {
    "newAccount": {
        "user": "6ab88b4447391c5f5c9453c5",
        "currency": "INR",
        "_id": "6ab88dbb15a95611b664ed94",
        "createdAt": "2026-09-27T03:30:03.280Z",
        "updatedAt": "2026-09-27T03:30:03.280Z",
        "__v": 0
    }
}
*/
}

module.exports = { createAccountController };
