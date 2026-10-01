
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
        res.status(400).json({
            message:"fromAccount, toAccount, amount and idempotencyKey are required"
        })
    }

}