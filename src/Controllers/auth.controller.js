const userModel=require("../Models/user.model")

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

    //returning with jwt token
}
module.exports={userRegisterController};