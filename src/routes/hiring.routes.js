const { rejectHiringController, hiredStudentsController, hireStudentController } = require('../controller/hiring.controller')
const jwt = require('../middleware/jwt')
const express = require('express')

const hiringRoutes = express.Router()

    hiringRoutes
    .route('/hiring')
    .get(jwt.verifyUser,hiredStudentsController)
    .post(jwt.verifyUser,hireStudentController)
    .delete(jwt.verifyUser,rejectHiringController)

 
module.exports = hiringRoutes;