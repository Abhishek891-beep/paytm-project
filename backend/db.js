
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/paytmMEYOU")

const userSchema = mongoose.Schema( {
    firstName : String ,
    lastName : String ,
    username : String ,
    password : String 
})

const User = mongoose.model("User" , userSchema)


// references : foreign keys 

const accountSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User" ,
        required : true 
    },
    balance : {
        type : Number ,
        required : true
    }
})

const Account = mongoose.model("Account" , accountSchema);
















module.exports = {
    User ,
    Account
}