const {
  allCompanies,
  deleteCompany,
} = require("../controller/company.controller");
const jwt = require("../middleware/jwt");
const express = require("express");

const companyRoutes = express.Router();

companyRoutes
  .route("/company")
  .get(jwt.verifyUser, allCompanies)
  .delete(jwt.verifyUser, deleteCompany);

module.exports = companyRoutes;
