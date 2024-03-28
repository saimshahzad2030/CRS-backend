const mongoose = require('mongoose')
const studentSchema = new mongoose.Schema({
    email:{type:String,required:true},
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    studentId:{type:String,required:true},
    age:{type:Number,required:true},
    faculty:{type:String,required:true},
    obtainedmarks:{type:Number,required:true},
    position:{type:String,required:true},
    experience:{type:String,required:true},
    availability:{type:String,required:true},
})

module.exports = mongoose.model('student',studentSchema)