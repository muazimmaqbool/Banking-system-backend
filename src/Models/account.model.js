const mongoose=require("mongoose");

const accountSchema=new mongoose.Schema({
    usewr:{
        type: mongoose.Schema.Types.ObjectId, // Stores the MongoDB _id of the related user
        ref:"user", // Tells Mongoose this ObjectId refers to the "user" collection (i.e in user.model.js)
        required:[true,"Account must be asscoiated with a user"],
        index:true, 
        //the index:true will help us find/searching this account fast as their could be millions of account
        //in mongodb we add this index:true so searching becomes fast
    },
    status:{
        enum:{
            values:["ACTIVE","FROZEN","CLOSED"],
            message:"Status can be either ACTIVE, FROZEN or CLOSED"
        }

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


const accountModel = mongoose.model("account", accountSchema);
module.exports = accountModel;

//Extra:
/*
Setting index:true in Mongoose (MongoDB) makes queries faster by creating a built-in lookup table for that specific field. 
Instead of searching through every single document in a collection one by one—a slow process known as a collection scan—MongoDB uses the index to jump directly to the relevant data, similar to using the index at the back of a textbook.

*/