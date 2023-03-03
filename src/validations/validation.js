const mongoose = require('mongoose')


const isValidSpace = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidEmail=function(email){
    return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)
}

const isValidPass = function (password) {
    return (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(password))
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


const isvalidRequest = function (body) {
    return Object.keys(body).length > 0 
}

const isValidName = function (name) {
    return /^[a-z ,.'-]+$/i.test(name)
}

module.exports={isValidEmail, isValidPass, isValidObjectId, isValidSpace, isvalidRequest, isValidName}
