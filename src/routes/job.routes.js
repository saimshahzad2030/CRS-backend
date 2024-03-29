const { addJobController, fetchJobsController, fetchCompanyJobsController, deleteJobDetailsController, updateJobDetailController, fetchJobsAdminController, deleteJobDetailsAdminController } = require('../controller/job.controller')
const jwt = require('../middleware/jwt')
const express = require('express')

const jobRoutes = express.Router()

    jobRoutes
    .route('/all-jobs')
    .get(jwt.verifyUser,fetchJobsController)
   

    jobRoutes
    .route('/company-jobs')
    .get(jwt.verifyUser,fetchCompanyJobsController)
    .post(jwt.verifyUser,addJobController)
    .patch(jwt.verifyUser,updateJobDetailController)
    .delete(jwt.verifyUser,deleteJobDetailsController)

    jobRoutes
    .route('/all-jobs-admin')
    .get(jwt.verifyAdmin,fetchJobsAdminController)
    .delete(jwt.verifyAdmin,deleteJobDetailsAdminController)
module.exports = jobRoutes;