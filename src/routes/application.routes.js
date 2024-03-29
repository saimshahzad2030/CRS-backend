const { addApplicationController, userApplicationsController, deleteApplicationController, companyApplicationsController, updateUserApplicationController,  } = require('../controller/application.controller')
const jwt = require('../middleware/jwt')
const express = require('express')

const applicationRoutes = express.Router()

    applicationRoutes
    .route('/application')
    .get(jwt.verifyUser,userApplicationsController)
    .post(jwt.verifyUser,addApplicationController)
    .delete(jwt.verifyUser,deleteApplicationController)
    .patch(jwt.verifyUser,updateUserApplicationController)

    applicationRoutes
    .route('/all-applications')
    .get(jwt.verifyUser,companyApplicationsController)
module.exports = applicationRoutes;