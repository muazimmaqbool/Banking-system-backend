const {Router}=require("express");
const {jwtAuthMiddleware,authSystemUserMiddleware}=require("../middleware/auth.middleware")
const transactionController =require("../Controllers/transaction.controller")

const transactionRoutes=Router()

//Note goto this website for generation idempotencyKey: https://www.uuidgenerator.net/version7

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