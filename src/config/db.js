const mongoose = require('mongoose');

async function connectToDB(){
    try {
      await mongoose.connect(process.env.MONGO_DB_URI)
        
      console.log("Connected to Database successfully");

    } catch (error) {
        console.log("Error while connecting to DB " , error)
    }
}


module.exports = connectToDB