const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    }
},
    {
        timestamps:true
    }
)

const userModel = mongoose.model("user",userSchema)

module.exports = userModel