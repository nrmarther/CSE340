// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const accountRoute = require("../models/account-model")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// route for login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// route for registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

module.exports = router;