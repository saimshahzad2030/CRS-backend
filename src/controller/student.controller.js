const Student = require('../model/student.model')
const catchAsync = require('../utils/catch-async')

const User = require('../model/user.model')
const studentModel = require('../model/student.model')



const addStudentDetailController = catchAsync(async (req, res) => {
    console.log(req.user.role)
    if (req?.user?.role != 'student') {
        res.status(401).json({ message: 'You are not authorized' })

    }
    else {

        const { firstname, lastname,experience, studentId, age, faculty, obtainedmarks, position, availability } = req.body;

        if (!firstname || !lastname || !experience || !studentId || !age || !faculty || !obtainedmarks || !position || !availability) {
            res.status(400).send('All fields required');
            return;
        }

        else {
            const email = req?.user.email;
            const isStudentAlreadyExist = await Student.findOne({ email })
            if (isStudentAlreadyExist) {
                res.status(402).json({ message: "Already Exist" })
                return
            }

            const studentDetails = new Student({
                email, firstname,experience, lastname, studentId, age, faculty, obtainedmarks, position, availability
            });


            await studentDetails.save();

            res.status(200).send(studentDetails);

        }

    }
})


const updateStudentDetailController = catchAsync(async (req, res) => {
    if (req?.user?.role != 'student') {
        res.status(401).json({ message: 'You are not authorized' })

    }
    else {

        const { firstname, lastname, studentId, age,experience, faculty, obtainedmarks, position, availability } = req.body;

        if (!firstname || !lastname || !studentId || !experience || !age || !faculty || !obtainedmarks || !position || !availability) {
            res.status(400).send('All fields required');
            return;
        }

        else {
            const email = req?.user.email;
            const studentDetailExist = Student.findOne({ email })
            if (!studentDetailExist) {
                res.status(402).json({ message: 'No entries found' })
                return;
            }
            const filter = { email }; // Specify the email value you want to match
            const update = { $set: { firstname, lastname,experience, studentId, age, faculty, obtainedmarks, position, availability } };

            await Student.updateOne(filter, update);


            res.status(200).json({ message: 'updated Succesfully' });

        }

    }
})

const fetchStudentDetailsController = catchAsync(async (req, res) => {
    console.log(req.user.role)
    if (req?.user?.role != 'student') {
        res.status(401).json({ message: 'You are not authorized' })
        return;
    }

    const email = req?.user.email;
    const studentDetailExist = await Student.findOne({ email })
    if (!studentDetailExist) {
        res.status(400).json({data:studentDetailExist, message: 'No details found' })

    }
    else {

        res.status(200).json({ data: studentDetailExist, message: 'details fetched' });
    }

})


const allStudentsDetails = async (req, res) => {
    try {
        if ( req?.user.role === 'company') {
            const users = await Student.find({employmentstatus:'jobless'});
            res.status(200).json({ data: users, message: 'Students Fetched' })
        }
        else if(req?.user.role === 'admin'){
            
            const users = await Student.find({});
            res.status(200).json({ data: users, message: 'Students Fetched' })
        }
        else {
            res.status(401).send("you are not authorized")
        }
    }
    catch (error) {
        return res.status(520).json({ message: error.message });
    }
}





//admin
const allStudentsDetailsAdmin = catchAsync(async (req, res) => {
   
            const users = await Student.find({});
            res.status(200).json({ data: users, message: 'Students Fetched' })
        
})

const deleteStudent = catchAsync(async (req, res) => {
    const {id} = req.query;
    if (!id) {
        res.status(401).send('Enter Id')
    }
    else {
        const findUser = await User.findOne({ _id:id });
        if (!findUser) {
            res.status(401).send('No Student Found')
        }
        else {
            const email = findUser.email;
            await User.deleteOne({ _id:id })
            await studentModel.deleteMany({email})
            console.log('deleted succesfully')
            res.status(200).json({ message: `${email} Deleted Successfully` })

        }
    }


})

const deleteStudentDetails = catchAsync(async (req, res) => {
    const {id} = req.query;
    if (!id) {
        res.status(401).send('Enter Id')
    }
    else {
        const findUser = await Student.findOne({ _id:id });
        if (!findUser) {
            res.status(401).send('No Student details Found')
        }
        else {
            await Student.deleteOne({ _id:id })
            console.log('deleted succesfully')
            res.status(200).json({ message: `Deleted Successfully` })

        }
    }


})
const allCampusStudents = catchAsync(async (req, res) => {
    
      
            const users = await Student.find({});
            res.status(200).json({ data: users, message: 'Students Fetched' })
        
      
    
   
})



module.exports = { deleteStudentDetails,allStudentsDetailsAdmin,allStudentsDetails,allCampusStudents ,deleteStudent, addStudentDetailController, updateStudentDetailController,fetchStudentDetailsController }