const {} = require('../controller/company.controller')
const jwt = require('../middleware/jwt')
const express = require('express')

const companyRoutes = express.Router()

    companyRoutes
    .route('/company')
    .get(jwt.verifyUser,allStudents)
    .post(jwt.verifyUser,addStudentDetailController)
    .patch(jwt.verifyUser,updateStudentDetailController)
    .delete(jwt.verifyUser,deleteStudent)

module.exports = companyRoutes;