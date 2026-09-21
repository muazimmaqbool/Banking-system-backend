//in this file we will create and config server but we will not call server here we will call server in server.js file

const express=require("express");

//using auth routes
const authRouter=require("./Routes/auth.routes")

//this app constant will have access to all express methods
const app=express();

//every api requires whose endpoint contains: /api/auth will be redirected to authRouter
app.use("/api/auth",authRouter)

module.exports=app