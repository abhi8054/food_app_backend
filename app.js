const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const dbConnection =  require("./config/database");
const userRoutes =  require("./routes/userRoute");
const foodRoutes = require("./routes/foodRoute")
const auth = require("./middleware/auth");
const path = require("path")

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'public')))

app.set("view engine","ejs")
app.set("views","./views")

app.use(auth)

app.use("/user",userRoutes);
app.use("/food",foodRoutes);

(async function(){
    try{
        await dbConnection()
        app.listen(process.env.PORT,() =>{
            console.log(`Server started at ${process.env.PORT}`)
            console.log(`Database Connected Successfully`)
        })
    }catch(e){
        console.log(e.message)
    }
})();


