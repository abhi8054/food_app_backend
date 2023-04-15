const jwt = require("jsonwebtoken")
const common = require("../config/common")

module.exports =  (req,res,next) =>{
    const public_url = [
        "register",
        "login",
        "forgot_password",
        "forgot_password_form",
        "update_forgot_password"
    ]
    let path = req.path.split("/")
    if(public_url.includes(path[2])){
        next()
    }else{
        const secret_key = req.headers['secret_key']
        const token = req.headers['authorization']
        if(!secret_key || !token){
            common.send_response(res,0,"Authorization is Required",null)
        }else{
            if(secret_key === process.env.SECRET_KEY){
                try{
                    const isValid = jwt.verify(token.split(" ").pop(),process.env.SECRET_KEY)
                    req.token = isValid
                    next()
                }catch(err) {
                    console.log(err.message)
                    common.send_response(res,0,"Token Expire",null)
                }
            }else{
                common.send_response(res,0,"Access Denied",null)
            }
        }
    }
}