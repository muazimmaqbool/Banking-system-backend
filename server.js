//we will start server here
const app=require("./src/app")

const PORT=5000; // or use 3000

//for testing whether the server is working or not

app.get("/",(req,res)=>{
    res.send("Banking server is working")
})
//http://localhost:5000/

app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`)
})
