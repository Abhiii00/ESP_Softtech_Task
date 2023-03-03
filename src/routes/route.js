let express = require('express')
let router = express.Router()

//--------------------|| CONTROLLERS ||----------------------

let userController = require('../controllers/userContoller')

//--------------------|| MIDDLEWARE ||----------------------

const mid = require("../middleware/middleware.js")  


//--------------------|| ROUTER'S ||----------------------

router.post('/registerUser',userController.registerUser)
router.post('/loginUser',userController.loginUser)
router.get('/getUserList',userController.getUserList)
router.get('/getUserProfile/:userId',userController.getUserProfile)
router.put('/updateUser/:userId',mid.authentication,mid.Authorisation,userController.updateUser)
router.delete('/deleteUser/:userId',mid.authentication,mid.Authorisation,userController.deleteUser)

//--------------------|| TO VALIDATE ENDPOINT ||----------------------

router.all("/*", function (req, res) {
    res.status(400).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct !!!"
    })
})

module.exports = router