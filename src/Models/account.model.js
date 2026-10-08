const mongoose=require("mongoose");
const ledgerModel=require("./ledger.model")

const accountSchema=new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, // Stores the MongoDB _id of the related user
        ref:"user", // Tells Mongoose this ObjectId refers to the "user" collection (i.e in user.model.js)
        required:[true,"Account must be asscoiated with a user"],
        index:true, 
        //the index:true will help us find/searching this account fast as their could be millions of accounts
        //in mongodb we add this index:true so searching becomes fast
    },
    status:{
        type:String,
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message:"Status can be either ACTIVE, FROZEN or CLOSED",
        },
        default:"ACTIVE"

    },
    currency:{
        type:String,
        required:[true,"Currency is required for creating an account"],
        default:"INR"
    },
    
},{
    timestamps:true
})

// Creating a compound index on user + status to make queries like
// "find accounts for this user and status" faster and more efficient.
accountSchema.index({ user: 1, status: 1 });

//method which will get balance of this account
accountSchema.methods.getBalance = async function(){
 // the balance we will calculate is from ledgers 
 // balance will be calculated based on ledger type i.e:
 // ledger entries with type "DEBIT" we will add them and subtract with sum ledgers of type "CREDIT" this will give us final balance

 //Formula: Balance = Total Credit - Total Debit

 const balanceData = await ledgerModel.aggregate([
  // Find all ledger transactions for this account
  {
    $match: { account: this._id }
  },

  // Group transactions and calculate total debit and credit
  {
    $group: {
      _id: null,

      // Calculate total debited amount
      totalDebit: {
        $sum: {
          $cond: [
            { $eq: ["$type", "DEBIT"] },
            "$amount",
            0
          ]
        }
      },

      // Calculate total credited amount
      totalCredit: {
        $sum: {
          $cond: [
            { $eq: ["$type", "CREDIT"] },
            "$amount",
            0
          ]
        }
      }
    }
  },

  // Calculate final balance: Credit - Debit
  {
    $project: {
      _id: 0, // Remove MongoDB's _id field
      balance: {
        $subtract: ["$totalCredit", "$totalDebit"]
      }
    }
  }
]);


 //when account is new i.e no ledger entry then balanceData will be an empty array [] the we return balance as 0
 if(balanceData.length===0){
    return 0
 }

 //when balance is available then returning balance
 return balanceData[0].balance
}


const accountModel = mongoose.model("account", accountSchema);
module.exports = accountModel;

//Extra:
/*
Setting index:true in Mongoose (MongoDB) makes queries faster by creating a built-in lookup table for that specific field. 
Instead of searching through every single document in a collection one by one which is a slow process known as a collection scan
MongoDB uses the index to jump directly to the relevant data, similar to using the index at the back of a textbook.

*/