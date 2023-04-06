const mongoose =  require("mongoose")

const dbConnection = async () =>{

    return new Promise(async (resolve,reject) =>{
        try{
            const connection = await mongoose.connect(process.env.DATABASE_URL)
            resolve(connection)
        }catch(e){
            console.log(e)
            reject(e)
        }
    })
}


module.exports = dbConnection
