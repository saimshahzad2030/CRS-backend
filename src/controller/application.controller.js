const Application = require('../model/application.model')
const catchAsync = require('..//utils/catch-async')
const HiredStudents = require('../model/hired-students.model')
const Jobs = require('../model/job.model')
const addApplicationController = catchAsync(async (req, res) => {
    if (req?.user?.user?.role != 'student') {
        res.status(401).json({ message: 'You are not authorized' })
    }
    else {
        const { jobId } = req.body;

        if (!jobId ) {
            res.status(400).send('All fields required');
            return;
        }

        else {
            const email = req?.user.user?.email;
            const studentId = req?.user?.user?._id;
            const applicationAlreadyPending = await Application.findOne({jobId,studentId})
            const job = await Jobs.findOne({_id:jobId})
            if(applicationAlreadyPending){
                return res.status(400).send('Already Pending')
            }
            const application = new Application({jobId,companyId:job.companyId,companyname:job.companyname,studentId, position:job.position,experience:job.experience,location:job.location,availability:job.availability,status:'pending',appliedBy:email });
            await application.save();
            res.status(200).json({data:application});

        }

    }
})
const userApplicationsController = catchAsync(async (req, res) => {
    console.log(req?.user?.user?.role)
    if (req?.user?.user.role != 'student') {
        res.status(401).json({ message: 'You are not authorized' })
    }
    else {
       
            const studentId = req?.user?.user?._id;
            const application = await Application.find({studentId});
            res.status(200).json({data:application});
    }
})
const deleteApplicationController = catchAsync(async (req, res) => {
    console.log(req?.user?.user?.role)
    if (req?.user?.user.role != 'student') {
        res.status(401).json({ message: 'You are not authorized' })
    }
    else {
            const {id} = req.query;
            if(!id){
                return res.status(400).send('all fields required')
            }
             const application = await Application.findOne({_id:id});
             const studentId = application?.studentId;
             const position = application?.position;
             await Application.deleteOne({_id:id});
             await HiredStudents.deleteOne({studentId,position})
            res.status(200).json({message:'application deleted succesfully'});
    }
})


const companyApplicationsController = catchAsync(async (req, res) => {
    if (req?.user?.user?.role != 'company') {
        res.status(401).json({ message: 'You are not authorized' })
    }
    else {
        const companyId = req?.user?.user?._id;
             const applications = await Application.find({companyId});
            res.status(200).json({data:applications,message:'applications fetched succesfully'});
    }
})


const updateUserApplicationController = catchAsync(async (req, res) => {
    if (req?.user?.user?.role != 'company') {
        res.status(401).json({ message: 'You are not authorized' })

    }
    else {

        const { id,status  } = req.body;

        if (!id || !status) {
            res.status(400).send('All fields required');
            return;
        }

        else {
            const email = req?.user?.user?.email;
            const studentDetailExist =await  Application.findOne({ _id:id })
            if (!studentDetailExist) {
                res.status(402).json({ message: 'No entries found' })
                return;
            }
            const filter = { _id:id  };
            const update = { $set: { status } };
            await Application.updateOne(filter, update);
            if(status ==='approve'){
                const companyId = req?.user?.user?._id;
                const  hiring = new HiredStudents({email:studentDetailExist.appliedBy ,hiredBy:req.user.user.name,studentId:studentDetailExist.studentId, position:studentDetailExist.position,companyemail:email,companyId });
                await hiring.save();
            }
        
            res.status(200).json({ message: 'updated Succesfully' });

        }

    }
})

module.exports = {addApplicationController,userApplicationsController,deleteApplicationController,companyApplicationsController,updateUserApplicationController}