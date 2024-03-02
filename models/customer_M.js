const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const customerSchema = new mongoose.Schema({

    email:{
        type:String,
        required: [true, 'Please provide an email address'],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email address'
        ],
        unique:true,
    },
    password:{
        type: String,
        required: [true, 'Provide a password'],
        match:[
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/,
            'Password length should be >6 & have at least one lowercase, uppercase & special character'
        ],
    },
    fullname:{
        type:String,
        required: [true, 'Please provide a valid name'],
        minlength: 3,
        maxlength: 50
    },
    BearsFee:{
        type: Boolean,
    }


},{timestamps:true})

customerSchema.pre('save', async function(){
    const salt = bcrypt.genSalt(9)
    this.password = await bcrypt.hash(this.password, salt)
})

customerSchema.methods.createJWT = function(){
    return jwt.sign({customerID: this._id},process.env.SECRET_KEY,{expiresIn:process.en,})
}

customerSchema.methods.comparePSW = async function(password){
    const compare = await bcrypt.compare(password, this.password)
    return compare
}

module.exports = mongoose.model('Customer', customerSchema)