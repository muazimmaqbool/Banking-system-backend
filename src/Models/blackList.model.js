//this is used for clearning cookes and blacklisting token after logout
const mongoose=require("mongoose");

const tokenBlackListSchema=new mongoose.Schema({
    token:{
        type:String,
        required:[true,"Token is required to be blacklisted"],
        unique:[true,"Token is already blacklisted"]
    },
},{
    timestamps:true,
})

//now the token which we blacklist will stay in out database for just three days after that it will delete
tokenBlackListSchema.index({ createdAt: 1 }, {
    expireAfterSeconds: 60 * 60 * 24 * 3 // 3 days
})

const tokenBlackListModel=mongoose.model("tokenBlackList",tokenBlackListSchema);
module.exports=tokenBlackListModel