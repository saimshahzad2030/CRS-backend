const Student = require("../model/student.model");
const catchAsync = require("../utils/catch-async");

const User = require("../model/user.model");
const studentModel = require("../model/student.model");
const applicationModel = require("../model/application.model");

const addStudentDetailController = catchAsync(async (req, res) => {
  if (req?.user?.user?.role != "student") {
    res.status(401).json({ message: "You are not authorized" });
  } else {
    const {
      firstname,
      lastname,
      experience,
      age,
      faculty,
      obtainedmarks,
      position,
      availability,
    } = req.body;

    if (
      !firstname ||
      !lastname ||
      !experience ||
      !age ||
      !faculty ||
      !obtainedmarks ||
      !position ||
      !availability
    ) {
      res.status(400).send("All fields required");
      return;
    } else {
      const email = req?.user?.user?.email;
      const studentId = req?.user?.user?._id;
      const isStudentAlreadyExist = await Student.findOne({ studentId });
      if (isStudentAlreadyExist) {
        res.status(402).json({ message: "Already Exist" });
        return;
      }

      const studentDetails = new Student({
        email,
        firstname,
        experience,
        email,
        lastname,
        studentId,
        age,
        faculty,
        obtainedmarks,
        position,
        availability,
      });

      await studentDetails.save();

      res.status(200).send(studentDetails);
    }
  }
});

const updateStudentDetailController = catchAsync(async (req, res) => {
  if (req?.user?.user?.role != "student") {
    res.status(401).json({ message: "You are not authorized" });
  } else {
    const {
      firstname,
      lastname,
      age,
      experience,
      faculty,
      obtainedmarks,
      position,
      availability,
    } = req.body;
    console.log(req.body);
    if (
      !firstname ||
      !lastname ||
      !experience ||
      !age ||
      !faculty ||
      !obtainedmarks ||
      !position ||
      !availability
    ) {
      res.status(400).send("All fields required");
      return;
    } else {
      const email = req?.user?.user?.email;
      const studentId = req?.user?.user?._id;
      const studentDetailExist = Student.findOne({ studentId });
      if (!studentDetailExist) {
        res.status(402).json({ message: "No entries found" });
        return;
      }
      const filter = { studentId };
      const update = {
        $set: {
          firstname,
          lastname,
          experience,
          studentId,
          age,
          faculty,
          obtainedmarks,
          position,
          availability,
        },
      };

      await Student.updateOne(filter, update);

      res.status(200).json({ message: "updated Succesfully" });
    }
  }
});

const fetchStudentDetailsController = catchAsync(async (req, res) => {
  console.log(req?.user?.user?.role);
  if (req?.user?.user?.role != "student") {
    res.status(401).json({ message: "You are not authorized" });
    return;
  }

  const studentId = req?.user?.user?._id;
  const studentDetailExist = await Student.findOne({ studentId });
  if (!studentDetailExist) {
    res
      .status(400)
      .json({ data: studentDetailExist, message: "No details found" });
  } else {
    res
      .status(200)
      .json({ data: studentDetailExist, message: "details fetched" });
  }
});

const allStudentsDetails = async (req, res) => {
  try {
    console.log(req?.user?.user?.role);

    if (req?.user?.user?.role === "company") {
      const { page } = req.query;
      const limit = 10;
      const skip = (page - 1) * limit;
      const students = await Student.find({ employmentstatus: "jobless" })
        .skip(skip)
        .limit(limit);
      const totalPages = await Student.countDocuments({
        employmentstatus: "jobless",
      });

      const pages = Math.ceil(totalPages / 10);
      res
        .status(200)
        .json({ data: students, message: "Students Fetched", pages });
    } else if (req?.user?.user?.role === "admin") {
      const students = await Student.find({}).skip(skip).limit(limit);
      const totalPages = await Student.countDocuments({});

      const pages = Math.ceil(totalPages / 10);
      res
        .status(200)
        .json({ data: students, message: "Students Fetched", pages });
    } else {
      res.status(401).send("you are not authorized");
    }
  } catch (error) {
    return res.status(520).json({ message: error.message });
  }
};

//admin
const allStudentsDetailsAdmin = catchAsync(async (req, res) => {
  const { page } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;
  const users = await Student.find({}).skip(skip).limit(limit);
  const totalPages = await Student.countDocuments({});
  const pages = Math.ceil(totalPages / 10);
  res.status(200).json({ data: users, message: "Students Fetched", pages });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(401).send("Enter Id");
  } else {
    const findUser = await User.findOne({ _id: id });
    if (!findUser) {
      res.status(401).send("No Student Found");
    } else {
      const email = findUser.email;
      await User.deleteOne({ _id: id });
      await studentModel.deleteMany({ email });
      await applicationModel.deleteMany({ appliedBy: email });
      console.log("deleted succesfully");
      res.status(200).json({ message: `${email} Deleted Successfully` });
    }
  }
});

const deleteStudentDetails = catchAsync(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(401).send("Enter Id");
  } else {
    const findUser = await Student.findOne({ _id: id });
    if (!findUser) {
      res.status(401).send("No Student details Found");
    } else {
      await Student.deleteOne({ _id: id });
      console.log("deleted succesfully");
      res.status(200).json({ message: `Deleted Successfully` });
    }
  }
});
const allCampusStudents = catchAsync(async (req, res) => {
  const { page } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  const users = await User.find({ role: "student" }).skip(skip).limit(limit);
  const totalPages = await User.countDocuments({ role: "student" });
  const pages = Math.ceil(totalPages / 10);
  console.log(users);
  res.status(200).json({ data: users, message: "Students Fetched", pages });
});

module.exports = {
  deleteStudentDetails,
  allStudentsDetailsAdmin,
  allStudentsDetails,
  allCampusStudents,
  deleteStudent,
  addStudentDetailController,
  updateStudentDetailController,
  fetchStudentDetailsController,
};
