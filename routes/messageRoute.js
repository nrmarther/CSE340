const express = require("express")
const router = new express.Router() 
const messController = require("../controllers/messageController")
const utilities = require("../utilities/")

//message inbox page
router.get("/", utilities.checkLogin, utilities.handleErrors(messController.buildInbox))

//new message page
router.get("/compose", utilities.checkLogin, utilities.handleErrors(messController.buildCompose))

//archived messages page
router.get("/archive", utilities.checkLogin, utilities.handleErrors(messController.buildArchive))

//display message
router.get("/:messId", utilities.checkLogin, utilities.handleErrors(messController.buildByMessageId))

//send a new message POST
router.post("/send", utilities.checkLogin, utilities.handleErrors(messController.sendMessage))

//reply to a message page
router.get("/reply/:messId", utilities.checkLogin, utilities.handleErrors(messController.replyMessage))

//send message reply POST
router.post("/reply/:messId", utilities.handleErrors(messController.sendMessage))

//mark a message as read POST
router.post("/read", utilities.handleErrors(messController.markMessageRead))

//archive a message POST
router.post("/archive", utilities.handleErrors(messController.archiveMessage))

//delete a message POST
router.post("/delete", utilities.handleErrors(messController.deleteMessage))

module.exports = router;