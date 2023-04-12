const mongoose = require("mongoose")

const userForgotSchema = mongoose.Schema({
    code :{
        type:String,
        required:true,
    },
    expire:{
        type:Date,
        required:true,
        default:() => Date.now() + 900000
    },
    status:{
        type:Boolean,
        required:true,
        default:false
    }, 
    email:{
        type:String,
        required:true
    }
},
{timestamps:true}
)

const userForgotModel = mongoose.model("forgot_password",userForgotSchema)

module.exports = userForgotModel