const {Router}=require("express");
const {jwtAuthMiddleware,authSystemUserMiddleware}=require("../middleware/auth.middleware")
const transactionController =require("../Controllers/transaction.controller")

const transactionRoutes=Router()

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */
transactionRoutes.post("/",jwtAuthMiddleware,transactionController.createTransaction);

/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */
transactionRoutes.post("/system/initial-funds", authSystemUserMiddleware, transactionController.createInitialFundsTransaction)


module.exports=transactionRoutes;