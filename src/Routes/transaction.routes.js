const {Router}=require("express");
const {jwtAuthMiddleware}=require("../middleware/jwt")
const {createTransaction} =require("../Controllers/transaction.controller")

const transactionRoutes=Router()

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */
transactionRoutes.post("/",jwtAuthMiddleware,createTransaction);

module.exports=transactionRoutes;