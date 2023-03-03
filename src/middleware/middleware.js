const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel.js')
let v = require("../validations/validation.js")


//--------------------------|| AUTHENTICATION ||--------------------------------

const authentication = async function (req, res, next) {
    try {
        token = req.headers['x-api-key']
        if (!token) { return res.status(400).send({ status: false, message: "Token is missing" }) }
        decodedToken = jwt.verify(token, "esp_softtech010", (err, decode) => {
            if (err) {
                return res.status(400).send({ status: false, message: "token is not correct" })
            }
            req.decode = decode

            next()
        })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//--------------------------|| AUTHORIZATION ||--------------------------------


const Authorisation = async function (req, res, next) {
    try {
        let userId = req.params.userId
       
        if(!userId) return res.status(400).send({ status: false, message: "please provide userId in params" })
        if(!v.isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "please enter a valid userId" })

        let CheckUserId = await userModel.findOne({ _id: userId, isDeleted: false})
        if (!CheckUserId) return res.status(404).send({ status: false, message: "no user found" })
        
        if (userId != req.decode.userId) {
        return res.status(403).send({ status: false, message: "you are not Authorized person" })
        }
        next()
        
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = {authentication, Authorisation}