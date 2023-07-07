const express = require("express")
const router = new express.Router() 
const messageController = require("../controllers/messageController")
const utilities = require("../utilities/")

//message inbox page
router.get("/", utilities.handleErrors(messageController.buildInbox))

//new message page
router.get("/compose", utilities.handleErrors(messageController.buildCompose))

router.get("/archive", utilities.handleErrors(messageController.buildArchive))

router.post("/send", utilities.handleErrors(messageController.sendMessage))

module.exports = router;