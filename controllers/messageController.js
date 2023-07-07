const utilities = require("../utilities/")
const Message = {}
const messageModel = require("../models/message-model")
require("dotenv").config()

/* ****************************************
*  Deliver Inbox
* *************************************** */
 Message.buildInbox = async function(req, res, next) {
    let nav = await utilities.getNav()
    let title = res.locals.accountData.account_firstname + "'s Inbox"
    let account_id = res.locals.accountData.account_id
    let messages = await utilities.getUnreadMessages(account_id)
    res.render("./messages/inbox", {
        title,
        nav,
        errors: null,
        inbox: messages,
    })
}

/* ****************************************
*  Deliver new message view
* *************************************** */
 Message.buildCompose = async function(req, res, next) {
    let nav = await utilities.getNav()
    let sender_dropdown = await utilities.getAccounts()
    let message_from = res.locals.accountData.account_id
    res.render("./messages/newMessage", {
        title: "New Message",
        nav,
        errors: null,
        sender_dropdown,
        message_from
    })
}

/* ****************************************
*  Deliver Archive View
* *************************************** */
Message.buildArchive = async function(req, res, next) {
    let nav = await utilities.getNav()
    let title = res.locals.accountData.account_firstname + "'s Archive"
    res.render("./messages/archive", {
        title,
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process new Message POST
* *************************************** */
Message.sendMessage = async function(req, res) {
    let nav = await utilities.getNav()
    let title = res.locals.accountData.account_firstname + "'s Inbox"
    const {message_to
          , message_from
          , message_subject
          , message_body} = req.body
    const sendMessage = await messageModel.sendMessage(message_to, message_from, message_subject, message_body)

    if (sendMessage) {
        nav = await utilities.getNav();
        req.flash(
            "success",
            `Message to ${message_to} was sent successfully.`
        )
        res.status(201).render("./messages/inbox", {
        title,
        nav,
        errors: null,
        })
    } else {
        req.flash(
            "notice",
            "Message failed to send, Please try again.")
        res.status(501).render("/message/newMessage", {
            title: "New Message",
            nav,
            errors: null,
        })
    }
}
module.exports = Message