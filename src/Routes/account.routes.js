const express=require("express");
const {jwtAuthMiddleware}=require("../middleware/auth.middleware")
const accountController=require("../Controllers/account.controller")

const router=express.Router();

/**
 * - POST api/accounts/
 * - Create a new account
 * - Protected Route
 */
router.post("/",jwtAuthMiddleware,accountController.createAccountController)

module.exports=router