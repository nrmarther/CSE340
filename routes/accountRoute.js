// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const accountRoute = require("../models/account-model")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

//account management page
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))

// route for login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// route for registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// route for update account view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdate))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;