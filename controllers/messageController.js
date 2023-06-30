const utilities = require("../utilities/")
const Message = {}
//const accountModel = require("../models/account-model")
require("dotenv").config()

/* ****************************************
*  Deliver Inbox
* *************************************** */
 Message.buildInbox = async function(req, res, next) {
    let nav = await utilities.getNav()
    let title = res.locals.accountData.account_firstname + "'s Inbox"
    res.render("./messages/inbox", {
        title,
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver new message view
* *************************************** */
 Message.buildCompose = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./messages/newMessage", {
        title: "New Message",
        nav,
        errors: null,
    })
}

Message.buildArchive = async function(req, res, next) {
    let nav = await utilities.getNav()
    let title = res.locals.accountData.account_firstname + "'s Archive"
    res.render("./messages/archive", {
        title,
        nav,
        errors: null,
    })
}

module.exports = Message