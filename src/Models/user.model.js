const mongoose=require("mongoose");

const userScheme=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required for creating a user"], // this messge will be send when email is not provided
        trim:true,
        lowercase:true,
        unique:[true,"Email already exists"],
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid email address"],
        //regex i have copied from google just search email regex
    },
    name:{
        type:String,
        required:[true,"Name is required"]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[6,"Password should contain more than 6 characters"],
        select:false, //with select=false, whenever we fetch user data by any user query the password will not be returned by default
    }
},{
    timestamps:true, // this will track when was user created and when was last time user data was updated 
})

//this will be called just before saving user
userScheme.pre("save",async function(next){
    
})