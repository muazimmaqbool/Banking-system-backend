const {Router}=require("express");
const {jwtAuthMiddleware}=require("../middleware/jwt")

const transactionRoutes=Router()

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */
transactionRoutes.post("/",jwtAuthMiddleware);

module.exports=transactionRoutes;