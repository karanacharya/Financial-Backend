    const mongoose = require('mongoose');

    const userSchema = new mongoose.Schema({
        name : {
            type : String,
            required : [true , "Please Provide the user name"],
        },
        email : {
            type: String,
            required :[true, "Please provide the user email"],
            unique : true
        },
        password:{
            type :String,
            required :[true , "Please provide the password"]
        },
        role : {
            type : String,
            enum :["viewer" , "analyst", "admin"],
            default : "viewer"  
        },
        isActive : {
            type : Boolean,
            default : true
        },
        isDeleted:{
            type : Boolean,
            default : false
        }
    })


    const userModel = mongoose.model("user", userSchema);
    module.exports = userModel;