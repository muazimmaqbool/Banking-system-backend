const mongoose = require("mongoose");

function connectToDB() {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Server is connected to database...");
  }).catch((err)=>{
    console.log("Error in connected to database:",err);
    process.exit(1); // means we are closing our server as db connection failed
  });
}

module.exports=connectToDB;