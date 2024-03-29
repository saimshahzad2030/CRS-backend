const Job = require('../model/job.model')
const catchAsync = require('../utils/catch-async')

const addJobController = catchAsync(async (req, res) => {
    if (req?.user?.role != 'company') {
        res.status(401).json({ message: 'You are not authorized' })

    }

    else {

        const { companymessage, position,experience,location,availability } = req.body;
console.log(req.body)
        if (!companymessage || !position || !experience || !location || !availability) {
            res.status(400).send('All ds fields required');
            return;
        }

        else {
            const email = req?.user.email;
            const companyname = req?.user.name;
            const jobAlreadyExist =await Job.findOne({companyemail:email,position,experience,availability,companyname})
            if(jobAlreadyExist){
                return res.status(400).send('Job already exist')
            }
            const jobDetails = new Job({companyemail:email, companyname,companymessage, position,experience,location,availability });
            await jobDetails.save();
            res.status(200).json({data:jobDetails, message:'Job added succesfully'});

        }

    }
})


const fetchJobsController = catchAsync(async (req, res) => {
    if (req?.user?.role != 'student') {
            res.status(401).json({ message: 'You are not authorized' })
    }
    else {
            const jobs = await Job.find({});
            res.status(200).json({data:jobs,message:'data fetched'});
    }
})

const fetchCompanyJobsController = catchAsync(async (req, res) => {
    if (req?.user?.role != 'company') {
            res.status(401).json({ message: 'You are not authorized' })
    }
    else {
        const email = req?.user.email;
            const jobs = await Job.find({companyemail:email});
            res.status(200).json({data:jobs,message:'data fetched'});
    }
})


const updateJobDetailController = catchAsync(async (req, res) => {
    if (req?.user?.role != 'company') {
        res.status(401).json({ message: 'You are not authorized' })

    }
    else {

        const { id,companymessage, position,experience,location,availability  } = req.body;

        if (!id || !companymessage || !position || !experience || !location || !availability) {
            res.status(400).send('All fields required');
            return;
        }

        else {
            const email = req?.user.email;
            const companyname = req?.user.name
            const studentDetailExist = await Job.findOne({ _id:id })
            if (!studentDetailExist) {
                res.status(402).json({ message: 'No entries found' })
                return;
            }
            const filter = { _id:id  };
            const update = { $set: { companyname,companymessage, position,experience,location,availability  } };

            await Job.updateOne(filter, update);


            res.status(200).json({ message: 'updated Succesfully' });

        }

    }
})



const deleteJobDetailsController = catchAsync(async (req, res) => {
    if (req?.user?.role != 'company') {
        res.status(401).json({ message: 'You are not authorized' })
        return;
    }
    
    const {id} = req.query
    if(!id){
        return res.status(400).send('enter all fields')
    }
    const email = req?.user.email;
    const studentDetailExist = await Job.deleteOne({ _id:id })
    if (!studentDetailExist) {
        res.status(400).json({data:studentDetailExist, message: 'No details found' })

    }
    else {

        res.status(200).json({ data: studentDetailExist, message: 'deleted succesfully' });
    }

})


//admin
const fetchJobsAdminController = catchAsync(async (req, res) => {

      
            const jobs = await Job.find({});
            res.status(200).json({data:jobs,message:'data fetched'});
    
})

const deleteJobDetailsAdminController = catchAsync(async (req, res) => {
    const {id} = req.query
    if(!id){
        return res.status(400).send('enter all fields')
    }
    
    const studentDetailExist = await Job.deleteOne({ _id:id })
    if (!studentDetailExist) {
        res.status(400).json({ message: 'No details found' })
    }
    else {

        res.status(200).json({message: 'deleted succesfully' });
    }

})


module.exports = {deleteJobDetailsAdminController,fetchJobsAdminController,addJobController,fetchJobsController,fetchCompanyJobsController,updateJobDetailController,deleteJobDetailsController}