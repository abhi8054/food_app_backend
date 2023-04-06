const common = require("../config/common")
const userModel = require("../model/user")


const user_register = async (req,res) =>{
    const {email,password} = req.body
    if(email !=="" || password !== ""){
        const user_exist = await userModel.find({email:email})
        if(user_exist.length === 0){
            const hash_password = await common.encrypt_password(password)
            const doc = new userModel({
                email:email,
                password : hash_password
            })
            const save = await doc.save()
            if(save){
                common.send_email(email)
                .then(result =>{
                    common.send_response(res,1,"User Registered successfully and Email is sent",null)
                }).catch(err =>{
                    common.send_response(res,0,"Problem in sending Email",null)
                })
            }else{
                common.send_response(res,0,"Something went Wrong",null)
            }
        }else{
            common.send_response(res,0,"Email is already exist",null)
        }
    }else{
        common.send_response(res,0,"Email or Password is Required",null)
    }
}

const user_login = async (req,res) =>{
    const {email,password} = req.body
    if(email !=="" || password !== ""){
        const user = await userModel.findOne({email:email})
        if(user !== null){
            try{
                const valid = await common.decrypt_password(password,user.password)
                if((user.email === email) && valid){
                    const token = await common.generate_token(user)
                    try{
                        common.send_response(res,1,"Login Successfull",{
                            email:user.email,
                            token:token
                        })
                    }catch(e) {
                        common.send_response(res,0,"Problem in generating Token",null)
                    }
                }else{
                    common.send_response(res,0,"Email or Password is Invalid",null)
                }
            }catch(err) {
                common.send_response(res,0,"Something went Wrong",null)
            }
        }else{
            common.send_response(res,0,"Email or Password not Exist",null)
        }
    }else{
        common.send_response(res,0,"Email or Password is Required",null)
    }
}

const user_test = (req,res) => {
    console.log(req.body)
}

module.exports = {
    user_register,
    user_login,
    user_test
}