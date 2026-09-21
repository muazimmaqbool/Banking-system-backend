const express=require("express");
const router=express.Router()

const authController=require("../Controllers/auth.controller")

/**
* - registering a user:
* - POST: /api/auth/register
*/

router.post("/register",authController.userRegisterController)

module.exports=router