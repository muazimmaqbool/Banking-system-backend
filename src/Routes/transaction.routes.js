const {Router}=require("express");
const {jwtAuthMiddleware}=require("../middleware/jwt")
const transactionController =require("../Controllers/transaction.controller")

const transactionRoutes=Router()

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */
transactionRoutes.post("/",jwtAuthMiddleware,transactionController.createTransaction);

module.exports=transactionRoutes;