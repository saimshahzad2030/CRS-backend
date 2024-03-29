const catchAsync = require('..//utils/catch-async')
const HiredStudents = require('../model/hired-students.model')
const Application =require('../model/application.model')
const Student = require('../model/student.model')
const hiredStudentsController = catchAsync(async (req, res) => {
    console.log(req?.user?.role)
    if (req?.user?.role != 'company') {
        res.status(401).json({ message: 'You are not authorized' })
    }
    else {
            const email = req?.user.email;
            const hirings = await HiredStudents.find({companyemail:email});
            res.status(200).json({data:hirings});
    }
})
const rejectHiringController = catchAsync(async (req, res) => {
    console.log(req?.user?.role)
    if (req?.user?.role != 'company') {
        res.status(401).json({ message: 'You are not authorized' })
    }
    else {
            const {id} = req.query;
            if(!id){
                return res.status(400).send('all fields required')
            }
            const email = req?.user.email;
            const hiredOne =await HiredStudents.findOne({_id:id})
            console.log(hiredOne)
            await HiredStudents.deleteOne({_id:id});
            const filter1 = {email };
            const update2 = { $set: { employmentstatus:'jobless' } };
            await Student.updateOne(filter1, update2);
            res.status(200).json({message:'hiring rejected succesfully'});
    }
})


const hireStudentController = catchAsync(async (req, res) => {
    if (req?.user?.role != 'company') {
        res.status(401).json({ message: 'You are not authorized' })
    }
    else {
       const {email,studentId,position} = req.body
       if(!email || !studentId || !position ){
        return res.status(400).send('All fields required')
       }
       const companyEmail = req?.user.email;
       const studentDetailExist = await Student.findOne({ email })
       if (!studentDetailExist) {
           res.status(402).json({ message: 'No entries found' })
           return;
       }
       const filter = {email };
       const update = { $set: { employmentstatus:'hired' } };

       await Student.updateOne(filter, update);
       const hiringExist = await HiredStudents.findOne({email ,hiredBy:req.user.name,studentId, position,companyemail:companyEmail})
       if(hiringExist){
        return res.status(400).send('Already Exist')
       }
        const  newHiring = new HiredStudents({email ,hiredBy:req.user.name,studentId,companyemail:companyEmail ,position});
                await newHiring.save();
            
            res.status(200).json({data:newHiring});
    }
})
module.exports = {rejectHiringController,hiredStudentsController,hireStudentController}