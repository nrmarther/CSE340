const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    let login = await utilities.buildLogin()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    let register = await utilities.buildRegister()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver account update view
* *************************************** */
async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  res.render("./account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_id,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname,
            account_lastname,
            account_email,
            account_password 
        } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "success",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        // login,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        // register,
      })
    }
  }

  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

   /* ****************************************
 *  Process update request
 * ************************************ */
async function accountUpdate (req, res) {
  let nav = utilities.getNav()
  const { account_firstname,
          account_lastname,
          account_email,
          account_id
        } = req.body
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id)
    const accountData = await accountModel.getAccountById(account_id)
    console.log(accountData)

  if (updateResult) {
    try {
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return req.flash("success semi-bold", "The account was updated"), res.redirect("/account/")
      } catch (error) {
      return new Error('Access Forbidden')
     }
    } else {
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render(`/account/update`, {
        title: "Edit Account Infromation",
        nav,
        errors: null,
        account_id : account_id,
        account_firstname: account_firstname,
        account_lastname: account_lastname,
        account_email: account_email,
      })
  }
}

async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password, account_firstname, account_lastname, account_email} = req.body
  // Hash before storing
  let hashedPassword = await bcrypt.hashSync(account_password, 10)
  const accountPassword = await accountModel.updatePassword(hashedPassword, account_id)
  const accountData = await accountModel.getAccountById(account_id)
  if(accountPassword){
    try{
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return req.flash("success", "The account password was updated. Hope you didn't forget it."), res.redirect("/account/")
      } catch (error) {
      return new Error('Access Forbidden')
    }
    } else {
      req.flash("notice", "Sorry, the change of password failed.")
      res.status(501).render(`./account/update`, {
        title: "Edit Account Information",
        nav,
        errors: null,
        account_id: account_id,
        account_firstname: account_firstname,
        account_lastname: account_lastname,
        account_email: account_email,
      })
    }
}

module.exports = { buildLogin,
                   buildRegister,
                   registerAccount,
                   accountLogin,
                   buildAccount,
                   buildUpdate,
                   accountUpdate,
                   updatePassword }