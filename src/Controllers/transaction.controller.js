const transactionModel = require("../Models/transaction.model");
const ledgerModel = require("../Models/ledger.model");
const accountModel = require("../Models/account.model");
const emailService = require("../services/email");
const mongoose = require("mongoose");
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

//used inside transaction.routes.js
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
  if (!fromUserAccount) {
    return res.status(400).json({
      message: "Invalid from Account",
    });
  }
  if (!toUserAccount) {
    return res.status(400).json({
      message: "Invalid to Account",
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
  // console.log("balance:",balance)
  //Checking whether sender account as sufficient available balance for transaction or not
  //after checking it only then we can transfer money from sender to receiver's account
  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`,
    });
  }

  //5-> Create transaction (PENDING):
  //with the step 5 we will also do step 6,7 and 8
  //i.e Create DEBIT ledger entry, Create CREDIT ledger entry and Mark transaction COMPLETED
  //Note these 4 steps from 5 to 8 should be done at exactly at once and all should be done, if anyone among them fails
  //then start again (revert back) i.e these all should be done a
  let transaction;
  try {
    const session = await mongoose.startSession();
    session.startTransaction(); //means after that whatever you do either entire thing gets completed or nothing

    //Note: pass data in array when session is used

    //creating transaction
    transaction = (
      await transactionModel.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING",
          },
        ],
        { session },
      )
    )[0];
    //[0] means transaction will be at number 0

    //creating debit ledger entry
    const debitLedgerEntry = await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount: amount,
          transaction: transaction?._id,
          type: "DEBIT",
        },
      ],
      { session },
    );

    //after debit the credit process will be done after (currently after 10 seconds)
    await (() => {
      return new Promise((resolve) => setTimeout(resolve, 10 * 1000));
    })();

    //creating credit ledger entry
    const creditLedgerEntry = await ledgerModel.create(
      [
        {
          account: toAccount,
          amount: amount,
          transaction: transaction?._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    //marking transaction as completed
    await transactionModel.findOneAndUpdate(
      { _id: transaction._id },
      { status: "COMPLETED" },
      { session },
    );


    await session.commitTransaction();
    session.endSession();

    //sending email
    await emailService.sendTransactionEmail(
      req.user.email,
      req.user.name,
      amount,
      toAccount,
    );

    return res.status(201).json({
      message: "Transaction completed successfully",
      transaction: transaction,
    });
  } catch (error) {
    return res.status(400).json({
      message:
        "Transaction is Pending due to some issue, please retry after sometime",
    });
  }
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "toAccount, amount and idempotencyKey are required",
    });
  }

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!toUserAccount) {
    return res.status(400).json({
      message: "Invalid toAccount",
    });
  }

  //from account will of system account (i.e banks personal account that will initial first funds)
  const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
  });

  if (!fromUserAccount) {
    return res.status(400).json({
      message: "System user account not found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  //not saving transaction is database yet, only saved on server
  const transaction = new transactionModel({
    fromAccount: fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });

  const debitLedgerEntry = await ledgerModel.create(
    [
      {
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
    ],
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  return res.status(201).json({
    message: "Initial funds transaction completed successfully",
    transaction: transaction,
  });
}

module.exports = { createTransaction, createInitialFundsTransaction };
