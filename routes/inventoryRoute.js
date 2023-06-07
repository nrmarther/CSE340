// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/classification-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by vehicle inventory id
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Route to error
router.get("/KobeError", utilities.handleErrors(invController.throwError));

// Route to management page
router.get("/mgnt", utilities.handleErrors(invController.buildManagement));

// Route to Add Classification management form
router.get("/addClass", utilities.handleErrors(invController.buildNewClassification));

// Process new classification data
router.post(
    "/addClass",
    classValidate.classRules(),
    classValidate.checkClassificationData,
    utilities.handleErrors(invController.newClassification)
  ) 



module.exports = router;