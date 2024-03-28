
const { deleteStudent, allStudents, addStudentDetailController, updateStudentDetailController, fetchStudentDetailsController } = require('../controller/student.controller');
const jwt = require('../middleware/jwt')
const express = require('express')

const studentRoutes = express.Router()

    studentRoutes
    .route('/student')
    .get(jwt.verifyUser,fetchStudentDetailsController)
    .post(jwt.verifyUser,addStudentDetailController)
    .patch(jwt.verifyUser,updateStudentDetailController)
   
   
    studentRoutes
    .route('/students')
    .get(jwt.verifyAdmin,allStudents)
    .delete(jwt.verifyAdmin,deleteStudent)

module.exports = studentRoutes;