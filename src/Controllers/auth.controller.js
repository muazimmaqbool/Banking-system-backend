const userModel=require("../Models/user.model")

//user register controller
//will be used with this api: /api/auth/register inside app.routes.js file
function userRegisterController(req,res){
    const{email,password,name}=req.body()
}
module.exports={userRegisterController};