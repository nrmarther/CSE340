const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build inventory vehicle view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inventory_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inventory_id)
  const details = await utilities.buildVehiclePage(data)
  let nav = await utilities.getNav()
  const vehicleName = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
  res.render("./inventory/vehicle", {
    title: vehicleName,
    nav,
    details,
    errors: null,
  })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null,
  })
}

invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Create New Classification",
    nav,
    errors: null,
  })
}

invCont.throwError = async function(req, res, next) {
  try{
    throw new Error("this is my epic scary 500 error")
  }catch(error){
    next(error)
  }
}

/* ****************************************
*  Process new classification
* *************************************** */
invCont.newClassification = async function(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const addClassResult = await invModel.insertNewClassification(classification_name)

  if (addClassResult) {
    req.flash(
      "notice",
      `Congratulations, you added ${classification_name} to the list of classifications.`
    )
    res.status(201).render("inv/addClass", {
      title: "Create New Classification",
      nav,
      errors: null,
    })
  } else {
    req.flash(
      "notice",
      "Sorry, adding this Classification failed.")
      res.status(501).render("inv/addClass", {
        title: "Create New Classification",
        nav,
        errors: null,
      })
  }
}

module.exports = invCont;