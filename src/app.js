//in this file we will create and config server but we will not call server here we will call server in server.js file

const express=require("express");

//using auth routes
const authRouter=require("./Routes/auth.routes")

//this app constant will have access to all express methods
const app=express();

//using exporess.json midlleware
app.use(express.json())
//Note: by default the express server can't ready data of req.body by default, so it inorder to make it ready req.body data we are using express.json() middleware

//every api requires whose endpoint contains: /api/auth will be redirected to authRouter
app.use("/api/auth",authRouter)

module.exports=app