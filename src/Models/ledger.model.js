const mongoose = require("mongoose");

// It's a record of each account movement.
// Once created, it should remain append-only.
//this is single source of truth of all your transactions
const ledgerSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Ledger must be associated with an account"],
      index: true,
      immutable: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required for creating a ledger entry"],
      immutable: true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
      required: [true, "Ledger must be associated with an transaction"],
      index: true,
      immutable: true,
    },
    type: {
      type: String,
      enum: {
        values: ["CREDIT", "DEBIT"],
        message: "Type can be either CREDIT or DEBIT",
      },
      required: [true, "Ledger type is required"],
      immutable: true,
    },
  },
  {
    timestamps: true,
  },
);

function preventLedgerModification() {
  throw new Error("Ledger entries are immutable and cannot be modified or deleted")
}


ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findOneAndRemove", preventLedgerModification);
ledgerSchema.pre("findOneAndReplace", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);
ledgerSchema.pre("replaceOne", preventLedgerModification);
ledgerSchema.pre("updateMany",preventLedgerModification)

const ledgerModel = mongoose.model("ledger", ledgerSchema);
module.exports = ledgerModel;
