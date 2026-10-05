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

/**
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
router.get("/",jwtAuthMiddleware,accountController.getUserAccountsController)

/**
 * - GET /api/accounts/balance/:accountId
 */
router.get("/balance/:accountId",jwtAuthMiddleware,accountController)
module.exports=router