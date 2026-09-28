const mongoose=require('mongoose')

//It's a record kind of thing of each entry
//accounts transaction histroy
const ledgerSchema=new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Ledger must be associated with an account"],
        index:true,
        immutable:true, // once this is created we can't modify it
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating a ledger entry"],
        immutable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,"Ledger must be associated with an transaction"],
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Type can be either CREDIT or DEBIT"
        },
        required:[true,"Ledger type is required"],
        immutable:true
    }
})

//making sure this ledger entry won't be edited again
function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted")
}

//using 'preventLedgerModification' on different operation
//i.e making sure ledger won't get modified and if anyone tries to they get the above mentioned error
ledgerSchema.pre('findOneAndUpdate',preventLedgerModification);
ledgerSchema.pre('updateOne',preventLedgerModification)
ledgerSchema.pre('findOneAndDelete',preventLedgerModification)
ledgerSchema.pre('findOneAndReplace',preventLedgerModification)
ledgerSchema.pre('deleteMany',preventLedgerModification)
ledgerSchema.pre('deleteOne',preventLedgerModification)
ledgerSchema.pre('replaceOne',preventLedgerModification)
ledgerSchema.pre('findOneAndReplace',preventLedgerModification)
