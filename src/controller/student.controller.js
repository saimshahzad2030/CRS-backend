const Student = require('../model/student.model')
const catchAsync = require('../utils/catch-async')





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

const deleteStudent = async (req, res) => {
    try {
        const user = req?.user;
        console.log(user)
        const { email } = req.body
        if (user.role === 'admin') {

            if (!email) {
                res.status(401).send('Enter Email')
            }



            else {
                const findUser = await Student.findOne({ email });
                console.log(findUser)
                if (!findUser) {
                    res.status(401).send('No Student Found')
                }
                else {
                    await Student.deleteOne({ email, role: 'student' })
                    await BookedParking.deleteMany({ bookedBy: email })
                    console.log('deleted succesfully')
                    res.status(200).json({ message: `${email} Deleted Successfully` })

                }
            }
        }
        else {

            res.status(520).json({ message: "You are not authorized" });
        }
    }
    catch (error) {
        return res.status(520).json({ message: "internal server error", error: error.message });
    }
}

const allStudents = async (req, res) => {
    try {
        if (req?.user.role == 'admin') {
            const users = await Student.find({ role: 'student' });
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



module.exports = { allStudents, deleteStudent, addStudentDetailController, updateStudentDetailController,fetchStudentDetailsController }