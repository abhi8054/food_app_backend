const common = require("../config/common")
const userModel = require("../model/user")
const userForgotModel = require("../model/userForgotPassword")


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
                const content = `<h1>Welcome to our app</h1> <p>Regards</p> <p>Food App</p>`
                common.send_email(email,content)
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

const user_forgot_password = async (req,res) =>{
    const {email} = req.body
    if(!email){
        common.send_response(res,0,"Email is Required",null)
    }else{
        const emailInfo = await userModel.findOne({
            email:email
        })
        if(emailInfo !== null){
            const code = common.random_code(8)
            const content = `<h3>Below Forgot Link</h3> <a href="http://localhost:5000/user/forgot_password_form/${code}">Click Here </a> `
            common.send_email(email,content)
            .then(async result =>{
                const doc = new userForgotModel({
                    code:code,
                    email:email
                })
                try{
                    const forgotData = await doc.save() 
                    common.send_response(res,1,"Forgot Password link is Sent",forgotData)
                }catch(err){
                    console.log(err)
                    common.send_response(res,0,"Something Went Wrong",null)
                }
            }).catch(err =>{
                console.log(err)
                common.send_response(res,0,"Problem in sending Email",null)
            })
        }else{
            common.send_response(res,0,"Email is not Registered",null)
        }
    }
}

const forgot_password_form = async (req,res) =>{
    const {code} = req.params
    const linkInfo = await userForgotModel.findOne({
        code:code,
        status:false
    })
    if(linkInfo !== null){
        if(new Date(linkInfo.expire) > new Date()){
            res.render("./form.ejs",{
                code:code,
                email:linkInfo.email,
                err:""
            })
        }else{
            res.render("./message.ejs",{
                message:"Link is Expire"
            })
        }
    }else{
        res.render("./message.ejs",{
            message:"Link is Used"
        })
    }
}

const update_forgot_password = async (req,res) =>{
    const {password,confirm,code,email} = req.body
    if(!password || !confirm){
        res.render("./form.ejs",{
            email:email,
            code:code,
            err:"Fields required"
        })
    }else{
        if(password !== confirm){
            res.render("./form.ejs",{
                code:code,
                email:email,
                err:"New Password or Confirm Password not match"
            })
        }else{
            const hash_password = await common.encrypt_password(password)
            try{
                const updatePass = await userModel.findOneAndUpdate(
                    {email:email},
                    {
                        password:hash_password,
                    },
                    {new:true}
                )
                try{
                    const updateStatus = await userForgotModel.findOneAndUpdate(
                        {code:code,email:email},
                        {
                            status:true,
                        },
                        {new:true}
                    )
                    res.render("./message.ejs",{
                        message:"Password Change Success. You can leave the page"
                    })
                }catch(err){
                    console.log(err)
                    res.render("./message.ejs",{
                        message:"Something went wrong"
                    })
                }
            }catch(err){
                console.log(err)
                res.render("./message.ejs",{
                    message:"Something went wrong"
                })
            }
        }
    }
}
module.exports = {
    user_register,
    user_login,
    user_test,
    user_forgot_password,
    forgot_password_form,
    update_forgot_password
}