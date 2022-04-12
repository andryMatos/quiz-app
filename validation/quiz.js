const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateQuizInput(data){
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : "";
    data.category = !isEmpty(data.category) ? data.category : "";

    if (Validator.isEmpty(data.name)){
        errors.name = "Name field is required";
    }

    if (Validator.isEmpty(data.category)){
        errors.category = "Category field is required";
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }

}

