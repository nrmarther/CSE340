const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const messModel = require("../models/message-model")

validate.messageRules = () => {
    return [
        //message subject exists
        body("message_subject")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a message subject"),

        //message body exists
        body("message_body")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a message")

    ]
}

validate.checkComposeData = async (req, res, next) => {
    const{ message_to
         , message_subject
         , message_body
         , message_from
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let sender_dropdown = await utilities.getAccounts()
        res.render("./messages/newMessage", {
            title: "New Message",
            nav,
            errors,
            sender_dropdown,
            message_from
        })
        return
    }
    next()
}

validate.checkReplyData = async (req, res, next) => {
    const{ message_to
         , message_subject
         , message_body
         , message_from
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let OGMessage = await messageModel.getMessageById(req.params.messId)
        const recipient = await accModel.getAccountById(OGMessage.message_from)
        let sender = res.locals.accountData.account_id
        res.render("./messages/reply", {
            title: "Reply",
            nav,
            OGMessage,
            errors,
            sender,
            recipient
        })
        return
    }
    next()
}

module.exports = validate;