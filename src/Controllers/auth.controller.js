const userModel=require("../Models/user.model")
const jwt=require("jsonwebtoken")
const { jwtAuthMiddleware, generateToken } = require("../../jwt")

//user register controller
//will be used with this api: /api/auth/register inside app.routes.js file
async function userRegisterController(req,res){
    const{email,password,name}=req.body();

    //checking whether email already exists or not
    const isExists=await userModel.findOne({
        email:email
    })

    //returing if email already exists
    if(isExists){
        return res.status(422).json({
            message:"Email already exists",
            status:"Failed"
        })
    }

    //if user is new/email is new
    const user=await userModel.create({
        email,password,name
    })

    const payLoad={userId:user._id}
    //returning with jwt token
    const token=generateToken(payLoad);

    //now saving token in cookie
    res.cookies("token",token)

    //finall response after everything done
    res.status(201).json({
        user:{
            _id:user._id,
            name:user.name,
            email:user.email,
        },
        token:token
    })
}
module.exports={userRegisterController};