const express = require("express")
const {
    user_register,
    user_login,user_test
} = require("../controller/userController");

const route = express.Router()

route.post("/register",user_register)
route.post("/login",user_login)
route.post("/test",user_test)


module.exports = route
