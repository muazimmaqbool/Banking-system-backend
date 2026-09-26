const express=require("express");
const {jwtAuthMiddleware}=require("../middleware/jwt")

const router=express.Router();

/**
 * - POST api/accounts/
 * - Create a new account
 * - Protected Route
 */
router.post("/",jwtAuthMiddleware,)

module.exports=router