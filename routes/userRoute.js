const express = require("express")
const {
    user_register,
    user_login,
    user_test,
    user_forgot_password,
    forgot_password_form,
    update_forgot_password
} = require("../controller/userController");

const route = express.Router()

route.post("/register",user_register)
route.post("/login",user_login)
route.post("/forgot_password",user_forgot_password)
route.get("/forgot_password_form/:code",forgot_password_form)
route.post("/update_forgot_password",update_forgot_password)
route.post("/test",user_test)


module.exports = route
