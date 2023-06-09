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
/* ***************************
 *  Build new classification view
 * ************************** */
invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/addClassification", {
    title: "Create New Classification",
    nav,
    errors: null,
  })
}

invCont.buildNewInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let dropdown = await utilities.getClassifications()
  res.render("./inventory/addInventory", {
    title: "Add to Inventory",
    nav,
    dropdown,
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
    nav = await utilities.getNav();
    req.flash(
      "notice",
      `Congratulations, you added ${classification_name} to the list of classifications.`
    )
    res.status(201).render("inventory/addClassification", {
      title: "Create New Classification",
      nav,
      errors: null,
    })
  } else {
    req.flash(
      "notice",
      "Sorry, adding this Classification failed.")
      res.status(501).render("inventory/addClassification", {
        title: "Create New Classification",
        nav,
        errors: null,
      })
  }
}

/* ****************************************
*  Process new Inventory
* *************************************** */
invCont.newInventory = async function(req, res) {
  let nav = await utilities.getNav()
  let dropdown = await utilities.getClassifications()
  const { inv_make
    , inv_model
    , inv_year
    , inv_description
    , inv_image
    , inv_thumbnail
    , inv_price
    , inv_miles
    , inv_color
    , classification_name } = req.body

  //convert price and miles to int
  let inv_price_int, inv_miles_int
  try {
    inv_price_int = parseInt(inv_price)
    inv_miles_int = parseInt(inv_miles)
  } catch (error) {
    req.flash("notice", "sorry, there was an error processing vehicle.")
    res.status(500).render("inventory/addInventory", {
      title: "Add to Inventory",
      nav,
      dropdown,
      errors: null,
    })
  }
  //inserts data into inventory table
  const addInvResult = await invModel.insertNewVehicle(inv_make
    , inv_model
    , inv_year
    , inv_description
    , inv_image
    , inv_thumbnail
    , inv_price_int
    , inv_miles_int
    , inv_color
    , classification_name)

    //success
  if (addInvResult) {
    req.flash(
      "success",
      `Congratulations, you added ${inv_year} ${inv_make} ${inv_model} to the Inventory.`
    )
    res.status(201).render("inventory/addInventory", {
      title: "Add to Inventory",
      nav,
      dropdown,
      errors: null,

    })
    //failure
  } else { 
    req.flash(
      "notice",
      "Sorry, adding this vehicle failed.")
    res.status(501).render("inventory/addInventory", {
      title: "Add to Inventory",
      nav,
      dropdown,
      errors: null,
    })
  }
}

module.exports = invCont;