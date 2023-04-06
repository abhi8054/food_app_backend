const mongoose = require("mongoose")

const foodSchema = mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    type:{
        required:true,
        type:String
    },
    price:{
        required:true,
        type:Number
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user"
    }
},
    {
        timestamps:true
    }
)

const foodModel = mongoose.model("food",foodSchema)

module.exports = foodModel