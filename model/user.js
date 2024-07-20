const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    UserName:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

const UserSchema = mongoose.model("modal",userSchema)
module.exports = UserSchema;