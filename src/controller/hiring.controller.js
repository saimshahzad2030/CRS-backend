const catchAsync = require('..//utils/catch-async')
const HiredStudents = require('../model/hired-students.model')
const Application =require('../model/application.model')
const Student = require('../model/student.model')
const { addApplicationController } = require('./application.controller')
const hiredStudentsController = catchAsync(async (req, res) => {
    console.log(req?.user?.user?.role)
    if (req?.user?.user?.role != 'company') {
        res.status(401).json({ message: 'You are not authorized' })
    }
    else {
            const companyId = req?.user?.user?._id;
            const hirings = await HiredStudents.find({companyId});
            res.status(200).json({data:hirings});
    }
})
const rejectHiringController = catchAsync(async (req, res) => {
    if (req?.user?.user?.role != 'company') {
        res.status(401).json({ message: 'You are not authorized' })
    }
    else {
            const {id} = req.query;
            if(!id){
                return res.status(400).send('all fields required')
            }
            const email = req?.user?.user.email;
            const hiredOne =await HiredStudents.findOne({_id:id})
            await HiredStudents.deleteOne({_id:id});

            const application = await Application.findOne({studentId:hiredOne.studentId,position:hiredOne.position})
            console.log(application)
            const applicationFilter = {studentId:hiredOne.studentId,position:hiredOne.position}
            const applicationUpdate = {$set:{status:'reject'}}
            await Application.updateOne(applicationFilter,applicationUpdate)
            const filter1 = {email };
            const update2 = { $set: { employmentstatus:'jobless' } };
            await Student.updateOne(filter1, update2);
            res.status(200).json({message:'hiring rejected succesfully'});
    }
})


const hireStudentController = catchAsync(async (req, res) => {
    if (req?.user?.user?.role != 'company') {
        res.status(401).json({ message: 'You are not authorized' })
    }
    else {
       const {studentId,position} = req.body
       if(!studentId || !position ){
        return res.status(400).send('All fields required')
       }
       const companyEmail = req?.user?.user?.email;
       const studentDetailExist = await Student.findOne({ studentId })
       if (!studentDetailExist) {
           res.status(402).json({ message: 'No entries found' })
           return;
       }
       const email = studentDetailExist.email;
       const filter = {studentId };
       const update = { $set: { employmentstatus:'hired' } };

       await Student.updateOne(filter, update);
       const companyId = req?.user?.user?._id;
       const hiringExist = await HiredStudents.findOne({studentId, position,companyId})
       if(hiringExist){
        return res.status(400).send('Already Exist')
       }
        const  newHiring = new HiredStudents({email ,hiredBy:req?.user?.user?.name,studentId,companyemail:companyEmail ,position,companyId});
                await newHiring.save();
            
            res.status(200).json({data:newHiring});
    }
})
module.exports = {rejectHiringController,hiredStudentsController,hireStudentController}