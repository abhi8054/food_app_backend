const express = require("express")
const {
    add_food, 
    get_all_food, 
    get_food_by_id,
    delete_food,
    update_food
} = require("../controller/foodController")

const route = express.Router()

route.post("/add_food",add_food)
route.get("/get_all_food",get_all_food)
route.post("/get_food_by_id",get_food_by_id)
route.delete("/delete_food",delete_food)
route.put("/update_food",update_food)

module.exports = route