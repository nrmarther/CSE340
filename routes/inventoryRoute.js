// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/classification-validation")
const invValidate = require("../utilities/inventory-validation")

// Route to management page
router.get("/", utilities.CheckAccType, utilities.handleErrors(invController.buildManagement));

//route to get inventory as json objects
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//build the edit Inventory View
router.get("/edit/:inventory_id", utilities.CheckAccType, utilities.handleErrors(invController.editInventoryView))

//build the delete inventory view
router.get("/delete/:inventory_id", utilities.CheckAccType, utilities.handleErrors(invController.delInventoryView))

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by vehicle inventory id
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Route to error
router.get("/KobeError", utilities.handleErrors(invController.throwError));

// Route to Add Classification management form
router.get("/addClass", utilities.CheckAccType, utilities.handleErrors(invController.buildNewClassification));

// Route to Add Inventory management form
router.get("/addVehicle", utilities.CheckAccType, utilities.handleErrors(invController.buildNewInventory));

// Process new classification data
router.post(
    "/addClass",
    classValidate.classRules(),
    classValidate.checkClassificationData,
    utilities.handleErrors(invController.newClassification)
  ) 


// Process new Inventory data
router.post(
  "/addVehicle",
  invValidate.invRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.newInventory)
)

//Process update Inventory Data
router.post(
  "/update/", 
  invValidate.invRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

//Process Delete Inventory Data
router.post(
  "/delete/",
  utilities.handleErrors(invController.deleteInventory)
)


module.exports = router;