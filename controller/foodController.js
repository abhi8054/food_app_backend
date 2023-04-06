const foodModel = require("../model/food")
const common = require("../config/common")

const add_food = async (req,res) =>{
    const {name,type,price} = req.body
  
    if(!name || !price || !type){
        common.send_response(res,0,"All fields Required",null)
    }else{
        const doc = new foodModel({
            user:req.token.id,
            name:name,
            price:price,
            type:type
        })
    
        try{
            const save = await doc.save()
            console.log(save)
            common.send_response(res,1,"Food Added Successfully",save)
        }catch(err) {
            console.log(err)
            common.send_response(res,0,"Something Went Wrong",null)
        }
    }
}

const get_all_food = async (req,res) => {
    try{
        const foods = await foodModel.find({user:req.token.id}).populate({
            path:"user",
            select:"email"
        })
        common.send_response(res,1,"Food Fetch Successfully",foods)
    }catch(err) {
        console.log(err)
        common.send_response(res,0,"Something Went Wrong",null)
    }
}

const get_food_by_id = async (req,res) =>{
    const {id} = req.body
    try{
        const food = await foodModel.findOne({_id:id,user:req.token.id}).populate({
            path:"user",
            select:"email"
        })
        if(food !== null){
            common.send_response(res,1,"Find Successfully",food)
        }else{
            common.send_response(res,0,"Not Found",null)
        }
    }catch(err){
        console.log(err)
        common.send_response(res,0,"Something went Wrong",null)
    }
}

const delete_food = async (req,res) =>{
    const {id} = req.body
    try{
        const isDelete = await foodModel.findOneAndDelete({_id:id,user:req.token.id})
        if(isDelete !== null){
            common.send_response(res,1,"Delete Successfully",isDelete)
        }else{
            common.send_response(res,0,"Not Found",null)
        }
    }catch(err){
        console.log(err)
        common.send_response(res,0,"Something went Wrong",null)
    }
}

const update_food = async (req,res) =>{
    const {id,name,price,type} = req.body

    try{
        const updateFood = await foodModel.findOneAndUpdate(
            {_id:id,user:req.token.id},
            {
                name:name,
                price:price,
                type:type,
                user:req.token.id
            },
            {new:true}
        )

        if(updateFood !== null){
            common.send_response(res,1,"Updated Successfully",updateFood)
        }else{
            common.send_response(res,0,"Not Found",null)
        }
    }catch(err) {
        console.log(err)
        common.send_response(res,0,"Something Went Wrong",null)
    } 
}

module.exports = {
    add_food,
    get_all_food,
    get_food_by_id,
    delete_food,
    update_food,
}