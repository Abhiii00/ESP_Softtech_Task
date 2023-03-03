let mongoose = require('mongoose')


let userSchema = new mongoose.Schema({
    fname:{
        type: String,
        require: true,
        trim: true
    },
    lname:{
        type: String,
        require: true,
        trim: true
    },
    email:{
        type: String,
        require: true,
        trim: true
    },
    password:{
        type: String,
        require: true,
        trim: true
    },
    confirm_Password:{
        type: String,
        require: true,
        trim: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
},{timestamps: true})

module.exports = mongoose.model('user',userSchema)