const mongoose = require('mongoose')

const TBlacklist_Schema = new mongoose.Schema({
    token:{
        type:String,
        required:true,
        ref:"User"
    }
},{timestamps:true})

module.exports = mongoose.model('TBlacklist', TBlacklist_Schema)
