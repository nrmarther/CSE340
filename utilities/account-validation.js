const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required."),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

  /* ******************************
 * Check data and return errors or continue to registration or login
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }
  validate.checkLoginData = async (req, res, next) => {
    const {account_email} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email
      })
      return
    }
    next()
  }

/* ******************************
 * Check data and return errors or continue to update user info
 * ***************************** */
validate.checkAccountData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./account/update", {
      errors,
      title: "Edit Account Information",
      nav,
      account_id: account_id,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
    })
    return
  }
  next()
}
  validate.updateUserRules = () => {
    return [
     // firstname is required and must be string
     body("account_firstname")
       .trim()
       .isLength({ min: 1 })
       .withMessage("Please provide a first name."), // on error this message is sent.
 
     // lastname is required and must be string
     body("account_lastname")
       .trim()
       .isLength({ min: 2 })
       .withMessage("Please provide a last name."), // on error this message is sent.
 
     // valid email is required and cannot already exist in the DB
     body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      // .custom(async (account_email, {req}) => {
      //   const account_id = req.body.account_id
      //   const account = await accountModel.getAccountById(account_id)
      //   // Check if submitted email is same as existing
      //   if (account_email != account.account_email) {
      //     // No - Check if email exists in table
      //     const emailExists = await accountModel.checkExistingEmail(account_email)
      //     // Yes - throw error
      //     if (emailExists.count != 0) {
      //       throw new Error("Email exists. Please use a different email")
      //     }
      //   }
      // })
    ]
  }

/* ******************************
 * validate update password rules
 * ***************************** */
validate.updateAccountPasswordRules = () => {
  return [
  // password is required and must be strong password
  body("account_password")
    .trim()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet the requirements."),
  ]
  }

  /* ******************************
 * server side validation
 * ***************************** */
  validate.checkPassword = async (req, res, next) => {
    const { account_password, account_firstname, account_lastname, account_email, account_id } = req.body
    const accountData = await accountModel.getAccountById(account_id)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./account/edit-account", {
        errors,
        title: "Edit Account Information",
        nav,
        account_id,
        account_password,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
      })
      return
    }
    next()
  }


  
  module.exports = validate