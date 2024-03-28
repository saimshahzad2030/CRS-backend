const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    email:{type:String,required:true},
    username:{type:String,required:true},  
    name:{type:String},  
    password:{type:String,required:true},
    role:{type:String,default:'student'}
})

module.exports = mongoose.model('users',UserSchema)