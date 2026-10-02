const transactionModel = require("../Models/transaction.model");
const ledgerModel = require("../Models/ledger.model");
const accountModel = require("../Models/account.model");
const emailService = require("../services/email");
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
async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  //1-> validation user accounts (user request):
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "fromAccount, toAccount, amount and idempotencyKey are required",
    });
  }

  //checking whether the formAccount and toAccount exists or not
  //we will check them by id (i.e account id) as fromAccount and toAccount will contain account id's
  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });
  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  //if the accounts are not found
  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid from Account or to Account",
    });
  }

  //2-> validation idempotency key:
  //checking is their any other transaction linked/exist with this idempotency key (that user provided with in request)
  //this is to make sure amount don't get deduct/debitted or credited twice
  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });
  if (isTransactionAlreadyExists) {
    //Checking if already existed transaction succeeded i.e gets completed
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already processed and is completed",
        transaction: isTransactionAlreadyExists,
      });
    }

    //if transaction status is pending
    if (isTransactionAlreadyExists.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is stil processing",
      });
    }

    //if transaction status is failed
    if (isTransactionAlreadyExists.status === "FAILED") {
      return res.status(500).json({
        message: "Transaction processing failed, please retry",
      });
    }

    //if transaction status is reserved
    if (isTransactionAlreadyExists.status === "RESERVED") {
      return res.status(500).json({
        message: "Transaction was reversed, please retry",
      });
    }
  }

  //3-> Checking account status:
  //making sure both from and to account are Active and are not frozen or closed
  if (fromUserAccount.status !== "ACTIVE") {
    return res.status(500).json({
      message: "From Account must be ACTIVE to process transaction",
    });
  }
  if (toUserAccount.status !== "ACTIVE") {
    return res.status(500).json({
      message: "To Account must be ACTIVE to process transaction",
    });
  }

  //4-> Derive sender balance from ledger:

  //getting available balance of senders account
  const balance = await fromUserAccount.getBalance(); //getBalance method is of account model

  //Checking whether sender account as sufficient available balance for transaction or not
  //after checking it only then we can transfer money from sender to receiver's account
  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`,
    });
  }
  
}

module.exports = { createTransaction };
