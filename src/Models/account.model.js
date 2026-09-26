const mongoose=require("mongoose");

const accountSchema=new mongoose.Schema({
    usewr:{
        type: mongoose.Schema.Types.ObjectId, // Stores the MongoDB _id of the related user
        ref:"user", // Tells Mongoose this ObjectId refers to the "user" collection (i.e in user.model.js)
        required:[true,"Account must be asscoiated with a user"]
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

const accountModel=mongoose.model("account",accountSchema);
module.exports=accountModel;