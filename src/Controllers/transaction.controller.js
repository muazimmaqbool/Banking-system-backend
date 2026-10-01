const transactionModel=require("../Models/transaction.model")
const ledgerModel=require("../Models/ledger.model");
const accountModel=require("../Models/account.model")
const emailService=require("../services/email")
/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
 */
async function createTransaction(req,res){
    const {fromAccount,toAccount,amount,idempotencyKey}=req.body; 

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"fromAccount, toAccount, amount and idempotencyKey are required"
        })
    }

    //checking whether the formAccount and toAccount exists or not
    //we will check them by id (i.e account id) as fromAccount and toAccount will contain account id's
    const fromUserAccount=await accountModel.findOne({
        _id:fromAccount
    })
    const toUserAccount=await accountModel.findOne({
        _id:toAccount
    })

    //if the accounts are not found
    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message:"Invalid from Account or to Account"
        })
    }

}