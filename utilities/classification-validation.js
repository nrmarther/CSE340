const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classRules = () => {
    return [
        // classification name is required and must be a string
        // and cannot already exist
        body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a vehicle type.")
        .custom(async (classification_name) => {
            const classExists = await invModel.checkExistingClassification(classification_name)
            if (classExists){
                throw new Error("Vehicle type exists. Please enter a new Vehicle Classification.")
            }
        }),
    ]
}

/* ******************************
 * Check data and return errors or success
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/addClassification", {
            errors,
            title: "Create New Classification",
            nav,
            classification_name
        })
        return
    }
    next()
}

module.exports = validate