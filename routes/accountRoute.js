// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const accountRoute = require("../models/account-model")
const utilities = require("../utilities/")

// route for login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// route for registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister));

//to register a new account
router.post('/register', utilities.handleErrors(accountController.registerAccount));

module.exports = router;