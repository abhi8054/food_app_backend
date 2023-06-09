const nodeMailer =  require("nodemailer")
const bcrypt = require('bcrypt');
const jwt =  require("jsonwebtoken");

const send_response = (res,code,message,data) => {
    if(code === 1){
        res.send({
            code,
            message,
            data
        })
    }else{
        res.send({
            code,
            message,
            data
        })
    }
}

const encrypt_password = (password) =>{
    return new Promise((resolve,reject) =>{
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, function(err, hash_password) {
            if(err){
                reject(err)
            }
            resolve(hash_password)
        })
    });
}

const decrypt_password = (password,hash_password) =>{
    return new Promise((resolve,reject) =>{
        bcrypt.compare(password, hash_password, function(err, result) {
            if(err){
                reject(err)
            }
            resolve(result)
        });
    })
}

const generate_token = (request_data) =>{
    return new Promise((resolve,_) =>{
        resolve(jwt.sign({
            id:request_data._id,
            email:request_data.email
        },process.env.SECRET_KEY,{expiresIn:"5d"}))
    })
}


const send_email = (email,content) =>{
    return new Promise((resolve,reject) =>{      
        const transporter = nodeMailer.createTransport({
        service: 'gmail',
        secure:false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
        tls:{
            rejectUnauthorized:false
        }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'WELCOME',
            html: content
        };
      
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject(error)
            } else {
                resolve(info)
            }
        })
    });
}

const random_code = (length) =>{
    const string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    let code = ""
    for(let i = 0; i < length; i++){
        code += string[Math.floor(Math.random() * 10)]
    }
    return code
}

const formatDateTime = (datetime) => {
    var dd = datetime.getDate();
    var mm = datetime.getMonth() + 1;
    var yyyy = datetime.getFullYear();
    var hr = datetime.getHours();
    var min = datetime.getMinutes();
    var sec = datetime.getSeconds();
    if (dd < 10) { dd = '0' + dd }
    if (mm < 10) { mm = '0' + mm }
    if (hr < 10) { hr = '0' + hr }
    if (min < 10) { min = '0' + min }
    if (sec < 10) { sec = '0' + sec }
    datetime = yyyy + '-' + mm + '-' + dd + 'T' + hr + ':' + min + ':' + sec;
    return datetime
}

module.exports = {
    send_response,
    send_email,
    encrypt_password,
    decrypt_password,
    generate_token,
    random_code,
    formatDateTime
}