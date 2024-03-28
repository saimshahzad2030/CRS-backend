const Job = require('../model/job.model')
const catchAsync = require('../utils/catch-async')

const addJobController = catchAsync(async (req, res) => {
    if (req?.user?.role != 'company') {
        res.status(401).json({ message: 'You are not authorized' })

    }

    else {

        const { companyname,companymessage, position,experience,location,availability } = req.body;

        if (!companyname || !companymessage || !position || !experience || !location || !!availability) {
            res.status(400).send('All fields required');
            return;
        }

        else {
            const email = req?.user.email;
            const jobDetails = new CompanyJob({ companyname,companymessage, position,experience,location,availability });
            await jobDetails.save();
            res.status(200).json({data:jobDetails});

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


module.exports = {addJobController,fetchJobsController}