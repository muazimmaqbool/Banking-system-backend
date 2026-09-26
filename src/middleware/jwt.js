const jwt =require('jsonwebtoken')

//creating middleware 
//this middleware is used to check whether the user is loggedin or not 
//(via jwt tokwn) which we returned during login and it gets saved in cookies
//so we will check whether it's inside cookies or not
const jwtAuthMiddleware=async(req,res,next)=>{
    //checking both cookies and the request header has authorization token or not:
    const token=req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token) return res.status(401).json({error:"Token Not Found!"})

    //if token is not passed:
    if(!token){
        res.status(401).json({error:'Unauthorized access, token is missing'})
    }

    //when token is present:
    try {
        //verifying the JWT token: it will return decoded payload
        const decodedPayload=jwt.verify(token,process.env.JWT_SECRET_KEY)

        //this decodedPayload contains userId as when generating token inside auth.controller we gave it payload as userId
        //now finding user details by this userid
        const user=await userModel.findById(decodedPayload.userId)
        req.user=user
        next()
    } catch (error) {
        console.log(`Error in jwtAuthMiddleware: ${error}`)
        res.status(401).json({error:"Invalid Token"})
    }
}


//generate JWT token:
//token needs payload i.e userData that's why it takes parameter as user data or anyname
const generateToken=(userData)=>{
    //generating a new jwt token using user data
   // return jwt.sign(userData,process.env.JWT_SECRET_KEY)

    return jwt.sign(userData,process.env.JWT_SECRET_KEY,{expiresIn:"3d"}) //now generate token and check its expiry in jwt.io
    //Note make sure the payload i.e userData here in this case is object and if not object then do like this
    //return jwt.sign({userData},process.env.JWT_SECRET_KEY,{expiresIn:30000})

}
module.exports={jwtAuthMiddleware,generateToken}