const joi = require("@hapi/joi");

const register_patient = joi.object({
    fname: joi.string().max(20).required(),
    lname: joi.string().max(5).required(),
    mobile: joi.number().integer().min(1000000000).message("Invalid mobile number").max(9999999999).message("Invalid mobile number").required()
});

const v1orv2dose = joi.object({
    mobile: joi.number().integer().min(1000000000).message("Invalid mobile number").max(9999999999).message("Invalid mobile number").required()
});

const addstocks = joi.object({
    new_stocks: joi.number().integer().min(1).message("Invalid stock number").required()
});

module.exports = {
    register_patient : register_patient,
    addstocks : addstocks,
    v1orv2dose : v1orv2dose
}