const Application = require('../model/application.model')
const catchAsync = require('..//utils/catch-async')
const HiredStudents = require('../model/hired-students.model')
const addApplicationController = catchAsync(async (req, res) => {
    console.log(req?.user?.role)
    if (req?.user?.role != 'student') {
        res.status(401).json({ message: 'You are not authorized' })
    }
    else {
        const { companyname, position,experience,location,availability,studentId } = req.body;

        if (!companyname || !position || !experience || !location || !availability || !studentId) {
            res.status(400).send('All fields required');
            return;
        }

        else {
            const email = req?.user.email;
            const applicationAlreadyPending = await Application.findOne({companyname, position,appliedBy:email,studentId})
            console.log(applicationAlreadyPending)
            if(applicationAlreadyPending){
                return res.status(400).send('Already Pending')
            }
            const application = new Application({companyname,studentId, position,experience,location,availability,status:'pending',appliedBy:email });
            await application.save();
            res.status(200).json({data:application});

        }

    }
})
const userApplicationsController = catchAsync(async (req, res) => {
    console.log(req?.user?.role)
    if (req?.user?.role != 'student') {
        res.status(401).json({ message: 'You are not authorized' })
    }
    else {
       
            const email = req?.user.email;
            const application = await Application.find({appliedBy:email});
            res.status(200).json({data:application});
    }
})
const deleteApplicationController = catchAsync(async (req, res) => {
    console.log(req?.user?.role)
    if (req?.user?.role != 'student') {
        res.status(401).json({ message: 'You are not authorized' })
    }
    else {
            const {id} = req.body;
            if(!id){
                return res.status(400).send('all fields required')
            }
            const email = req?.user.email;
             const application = await Application.findOne({_id:id,appliedBy:email});
             const position = application.position;
             await Application.deleteOne({_id:id,appliedBy:email});
             await HiredStudents.deleteOne({email:email,position:position})
            res.status(200).json({message:'application deleted succesfully'});
    }
})


const companyApplicationsController = catchAsync(async (req, res) => {
    console.log(req?.user?.role)
    if (req?.user?.role != 'company') {
        res.status(401).json({ message: 'You are not authorized' })
    }
    else {
             const applications = await Application.find({companyname:req.user.name,status:'pending'});
            res.status(200).json({data:applications,message:'applications fetched succesfully'});
    }
})


const updateUserApplicationController = catchAsync(async (req, res) => {
    if (req?.user?.role != 'company') {
        res.status(401).json({ message: 'You are not authorized' })

    }
    else {

        const { id,status  } = req.body;

        if (!id || !status) {
            res.status(400).send('All fields required');
            return;
        }

        else {
            const email = req?.user.email;
            const studentDetailExist =await  Application.findOne({ _id:id })
            if (!studentDetailExist) {
                res.status(402).json({ message: 'No entries found' })
                return;
            }
            const filter = { _id:id  };
            const update = { $set: { status } };
            await Application.updateOne(filter, update);
            if(status ==='approve'){
             const  application = new HiredStudents({email:studentDetailExist.appliedBy ,hiredBy:req.user.name,studentId:studentDetailExist.studentId, position:studentDetailExist.position,companyemail:email });
                await application.save();
            }
        
            res.status(200).json({ message: 'updated Succesfully' });

        }

    }
})

module.exports = {addApplicationController,userApplicationsController,deleteApplicationController,companyApplicationsController,updateUserApplicationController}