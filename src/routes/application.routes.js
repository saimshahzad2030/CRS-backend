const { addApplicationController, userApplicationsController, deleteApplicationController } = require('../controller/application.controller')
const jwt = require('../middleware/jwt')
const express = require('express')

const applicationRoutes = express.Router()

    applicationRoutes
    .route('/application')
    .get(jwt.verifyUser,userApplicationsController)
    .post(jwt.verifyUser,addApplicationController)
    .patch(jwt.verifyUser)
    .delete(jwt.verifyUser,deleteApplicationController)

module.exports = applicationRoutes;