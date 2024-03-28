const { addJobController, fetchJobsController } = require('../controller/job.controller')
const jwt = require('../middleware/jwt')
const express = require('express')

const companyRoutes = express.Router()

    companyRoutes
    .route('/all-jobs')
    .get(jwt.verifyUser,fetchJobsController)
    .post(jwt.verifyUser,addJobController)

module.exports = companyRoutes;