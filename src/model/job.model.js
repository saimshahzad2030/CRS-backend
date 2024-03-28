const mongoose = require('mongoose')
const jobSchema = new mongoose.Schema({
    companyname:{type:String,required:true},
    companymessage:{type:String,required:true},
    position:{type:String,required:true},
    experience:{type:String,required:true},
    location:{type:String,required:true},
    availability:{type:String,required:true},
})

module.exports = mongoose.model('job',jobSchema)