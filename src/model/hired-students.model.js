const mongoose = require('mongoose')
const hiredStudentSchema = new mongoose.Schema({
    email:{type:String,required:true},
    studentId:{type:String,required:true},
    position:{type:String,required:true},
    hiredBy:{type:String,required:true},
    companyId:{type:String,required:true},
    companyemail:{type:String,required:true}
    
})

module.exports = mongoose.model('hired',hiredStudentSchema)