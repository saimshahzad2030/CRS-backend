const Application = require('../model/application.model')
const catchAsync = require('..//utils/catch-async')

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
             await Application.deleteOne({_id:id,appliedBy:email});
            res.status(200).json({message:'application deleted succesfully'});
    }
})
module.exports = {addApplicationController,userApplicationsController,deleteApplicationController}