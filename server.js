//we will start server here in this file:

require("dotenv").config(); // now we can use process.env.(variable name defined in .envfile)
const app=require("./src/app")
const connectToDB=require("./src/Config/db")

connectToDB();

const PORT=3000; // or use 5000

//for testing whether the server is working or not

app.get("/",(req,res)=>{
    res.send("Banking server is working")
})
//http://localhost:3000/

app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`)
    console.log("click here: http://localhost:3000")
})


/*
Note: Inside package.json we have added a script (script was added when project was created and server was setup)

    ->"dev":"npx nodemon server.js"
    -> "start": "node server.js"
    add here:
   "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1",
            "dev":"npx nodemon server.js",
            "start": "node server.js"
        }, is like this 
        ->"dev" is for development
        ->npx is Node Package Execute
        and nodemon: with the help of this package we don't need to run the server again and again after making any change

        ->"start": run "node server.js" in production

    ->After adding this script now to run ther server hit this command:
        npm run dev during development
        and
         npm run start during production i.e when server is live

    ->If you don't want to add this script you can directly hit this command: npm --watch server which will also do the same thing


*/