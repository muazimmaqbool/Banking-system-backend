//in this file we will create and config server but we will not call server here we will call server in server.js file
//by config we mean which api you are using and which middleware

const express=require("express");
const cookieParser=require("cookie-parser")



//this app constant will have access to all express methods
const app=express(); //creating server

//using exporess.json midlleware
app.use(express.json())
//Note: by default the express server can't ready data of req.body by default, so it inorder to make it ready req.body data we are using express.json() middleware

app.use(cookieParser()) 
// middleware used to save token in cookie check auth.controller.js file


//Importing Routes
const authRouter=require("./Routes/auth.routes")
const accountRouter=require("./Routes/account.routes")

//Using Routes
app.use("/api/auth",authRouter)
app.use("/api/accounts",accountRouter)

module.exports=app