const utilities = require("../utilities/")
const Message = {}
const messageModel = require("../models/message-model")
const accModel = require("../models/account-model")
require("dotenv").config()

/* ****************************************
*  Deliver Inbox
* *************************************** */
 Message.buildInbox = async function(req, res, next) {
    let nav = await utilities.getNav()
    let title = res.locals.accountData.account_firstname + "'s Inbox"
    let account_id = res.locals.accountData.account_id
    let messages = await messageModel.getUnarchived(account_id)
    let inbox_table = await utilities.getMessageTable(messages)
    res.render("./messages/inbox", {
        title,
        nav,
        errors: null,
        table: inbox_table,
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
    let account_id = res.locals.accountData.account_id
    let messages = await messageModel.getArchived(account_id)
    let archive_table = await utilities.getMessageTable(messages)
    res.render("./messages/archive", {
        title,
        nav,
        errors: null,
        table: archive_table,
    })
}

/* ****************************************
*  Deliver Message View
* *************************************** */
Message.buildByMessageId = async function(req, res, next) {
    const message_id = req.params.messId
    const data = await messageModel.getMessageById(message_id)
    const from = await accModel.getAccountById(data.message_from)
    let nav = await utilities.getNav()
    let title = data.message_subject
    const details = await utilities.buildMessagePage(from, data)
    res.render("./messages/message", {
        message_id,
        title,
        nav,
        details,
        errors: null
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
        const messages = await messageModel.getUnarchived(res.locals.accountData.account_id)
        const table = await utilities.getMessageTable(messages)
        const messageRecipient = await accModel.getAccountById(message_to)
        const messageRecipientName = messageRecipient.account_firstname + " " + messageRecipient.account_lastname
        req.flash(
            "success",
            `Message to ${messageRecipientName} was sent successfully.`
        )
        res.status(201).render("./messages/inbox", {
        title,
        nav,
        table,
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

/* ***************************
 *  Mark Message as Read POST
 * ************************** */
Message.markMessageRead = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {message_id} = req.body
    const markedRead = await messageModel.markMessageRead(message_id)

    if (markedRead) {
        req.flash("success", `The Message has been successfully marked as read`)
        res.redirect('/message')
    } else {
        const data = await messageModel.getMessageById(message_id)
        const from = await accModel.getAccountById(data.message_from)
        const details = utilities.buildMessagePage(from, data)
        req.flash("notice", `The Message failed to be marked as Read. Please try again`)
        res.status(501).render("/message/message", {
            title: data.message_subject,
            nav,
            details,
            errors: null
        })
    }
}

/* ***************************
 *  Archive Message POST
 * ************************** */
Message.archiveMessage = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {message_id} = req.body
    const archived = await messageModel.archiveMessage(message_id)

    if (archived) {
        req.flash("success", `The Message has been successfully archived`)
        res.redirect('/message')
    } else {
        const data = await messageModel.getMessageById(message_id)
        const from = await accModel.getAccountById(data.message_from)
        const details = utilities.buildMessagePage(from, data)
        req.flash("notice", `The Message failed to be archived. Please try again`)
        res.status(501).render("/message/message", {
            title: data.message_subject,
            nav,
            details,
            errors: null
        })
    }
}

/* ***************************
 *  delete Message
 * ************************** */
Message.deleteMessage = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {message_id} = req.body
    const archived = await messageModel.deleteMessage(message_id)

    if (archived) {
        req.flash("success", `The Message has been successfully deleted`)
        res.redirect('/message')
    } else {
        const data = await messageModel.getMessageById(message_id)
        const from = await accModel.getAccountById(data.message_from)
        const details = utilities.buildMessagePage(from, data)
        req.flash("notice", `The Message failed to be deleted. Please try again`)
        res.status(501).render("/message/message", {
            title: data.message_subject,
            nav,
            details,
            errors: null
        })
    }
}
module.exports = Message