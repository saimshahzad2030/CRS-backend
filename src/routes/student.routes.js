
const { deleteStudent, allStudentsDetails, addStudentDetailController, updateStudentDetailController, fetchStudentDetailsController, allCampusStudents, allStudentsDetailsAdmin, deleteStudentDetails } = require('../controller/student.controller');
const jwt = require('../middleware/jwt')
const express = require('express')

const studentRoutes = express.Router()

    studentRoutes
    .route('/student')
    .get(jwt.verifyUser,fetchStudentDetailsController)
    .post(jwt.verifyUser,addStudentDetailController)
    .patch(jwt.verifyUser,updateStudentDetailController)
   
   
    studentRoutes
    .route('/unemployed-students')
    .get(jwt.verifyUser,allStudentsDetails)
    
    studentRoutes
    .route('/all-students')

    .get(jwt.verifyAdmin,allCampusStudents)

    .delete(jwt.verifyAdmin,deleteStudent)

    studentRoutes
    .route('/all-student-details')

    .get(jwt.verifyAdmin,allStudentsDetailsAdmin)
    .delete(jwt.verifyAdmin,deleteStudentDetails)

module.exports = studentRoutes;