let userModel = require('../models/userModel')
let v = require('../validations/validation')
let jwt = require('jsonwebtoken')
let bcrypt = require('bcrypt')


//--------------------|| REGISTER USER ||----------------------

let registerUser = async function(req,res){
    try{
        let userData = req.body
        if(!v.isvalidRequest(userData)) return res.status(400).send({ status: false, message: "please input some data" })

        let {lname, fname, email, password, confirm_Password} = userData

        if (!v.isValidSpace(lname)) return res.status(400).send({ status: false, message: `lname is mandatory` })
        if (!v.isValidName(lname)) return res.status(400).send({ status: false, message: `lname is must in char` })
        if (!v.isValidSpace(fname)) return res.status(400).send({ status: false, message: `fname is mandatory` })
        if (!v.isValidName(fname)) return res.status(400).send({ status: false, message: `fname is must in char` })   
        if (!v.isValidSpace(email)) return res.status(400).send({ status: false, message: `email is mandatory` })
        if (!v.isValidEmail(email)) return res.status(400).send({ status: false, message: `please enter a valid email id` })
        if (await userModel.findOne({ email: email, isDeleted: false })) return res.status(400).send({ status: false, message: `email already registered` })
        if (!v.isValidSpace(password)) return res.status(400).send({ status: false, message: `password is mandatory` })
        if (!v.isValidPass(password)) return res.status(400).send({ status: false, message: `please enter a strong password :- min length 8, max length 15 and aleast 1 uppercase letter or special character`})
        if (!v.isValidSpace(confirm_Password)) return res.status(400).send({ status: false, message: `confirmation password is mandatory` })
        if(password !== confirm_Password) return res.status(400).send({status: false, msg: 'confiramation password should be same as the password'})

        const saltingRound = await bcrypt.genSalt(10)
        const encryptedPassword = await bcrypt.hash(password, saltingRound)
        userData.password = encryptedPassword
        userData.confirm_Password = encryptedPassword

        let createUser = await userModel.create(userData)
        return res.status(201).send({status: true, msg: 'success', data: createUser})
    }catch(err){
        return res.status(500).send({status: false, msg: err.message})        
    }
}

//--------------------|| LOGIN USER ||----------------------

let loginUser = async function(req,res){
    try{
        let userData = req.body
        if (!v.isvalidRequest(userData)) return res.status(400).send({ status: false, message: `please input login details` })

        let {email, password} = userData

        if (!email) return res.status(400).send({ status: false, message: "please input your email" })
        if (!v.isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
        if (!password) return res.status(400).send({ status: false, message: "please input your password" })
        if (!v.isValidPass(password)) return res.status(400).send({ status: false, message: `please enter a strong password :- min length 8, max length 15 and aleast 1 uppercase letter or special character` })
        let user = await userModel.findOne({ email: email });
        if (!user) return res.status(404).send({ status: false, message: "no user found by that email please register yourself" });
  
        let passCheck = await bcrypt.compare(password, user.password)
        if (!passCheck) return res.status(400).send({ status: false, message: "invalid password" });

        let token = jwt.sign({userId: user._id.toString()},'esp_softtech010')
        return res.send({ status: true, message: "Success", data: token });
    }catch(err){
        return res.status(500).send({status: false, msg: err.message})        
    }
}


//--------------------|| GET USER LIST ||----------------------

let getUserList = async function(req, res){
    try{
        let userList = await userModel.find({isDeleted: false}).select({lname:1, fname:1, email:1})
        if (userList.length == 0) return res.status(404).send({ status: false, message: "no users found" });
        return res.status(200).send({status: true, msg: 'success', users: userList})
    }catch(error){
        return res.status(500).send({status: false, msg: err.message})        
    }
}

//--------------------|| GET USER PROFILE ||----------------------

let getUserProfile = async function(req, res){
    try{
        let userId = req.params.userId
        if(!userId) return res.status(400).send({ status: false, message: "please provide a userId in params" })
        if(!v.isValidObjectId(userId)) return res.status(400).send({status: false, msg: 'Invalid userId'})
        let userProfile = await userModel.findOne({_id: userId, isDeleted: false}).select({lname:1, fname:1, email:1})
        if(!userProfile) return res.status(400).send({status: false, msg: 'No user found'})                     
        return res.status(200).send({status: true, msg: 'success', userProfile: userProfile})
    }catch(error){
        return res.status(500).send({status: false, msg: err.message})        
    }
}


//--------------------|| UPDATE USER ||----------------------

let updateUser = async function(req, res){
    try{
        let userId = req.params.userId

        let userData = req.body
        let {lname, fname, email, password, confirm_Password} = userData

        if(lname){
            if(!v.isValidName(lname)) return res.status(400).send({ status: false, message: `lname is must in char` })
        }
        if(fname){
            if(!v.isValidName(fname)) return res.status(400).send({ status: false, message: `fname is must in char` })
        }
        if(email){
            if (!v.isValidEmail(email)) return res.status(400).send({ status: false, message: `please enter a valid email id` })
            if (await userModel.findOne({ email: email, isDeleted: false })) return res.status(400).send({ status: false, message: `email already registered` })
        }
        if(password){
            if (!v.isValidPass(password)) return res.status(400).send({ status: false, message: `please enter a strong password :- min length 8, max length 15 and aleast 1 uppercase letter or special character`})
        
            const saltingRound = await bcrypt.genSalt(10)
            const encryptedPassword = await bcrypt.hash(password, saltingRound)
            userData.password = encryptedPassword
            userData.confirm_Password = encryptedPassword
        }

        let updatedUserData = await userModel.findByIdAndUpdate({ _id: userId},{$set:{...userData}},{new: true});
        return res.status(200).send({ status: true, message: "success", updatedUserData });
    }catch(err){
        return res.status(500).send({status: false, msg: err.message})        
    }
}


//--------------------|| DELETE USER ||----------------------

let deleteUser = async function(req, res){
    try{
        let userId = req.params.userId
        let deleteUser = await userModel.findByIdAndUpdate({ _id: userId}, { $set: { isDeleted: true } }, { new: true });
        return res.status(200).send({ status: true, message: "successfully deleted", deleteUser });
    }catch(error){
        return res.status(500).send({status: false, msg: err.message})        
    }
}

//--------------------|| EXPORTING MODULE ||----------------------

module.exports = {registerUser, loginUser, getUserList, getUserProfile, updateUser, deleteUser}