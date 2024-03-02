const {StatusCodes} = require('http-status-codes')
const Blacklist = require('../models/TBlacklist_M')
const customError = require('../middleware/customError')
const jwt = require('jsonwebtoken')

const auth = async(req, res, next)=>{

    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new customError('Authentication Invalid', StatusCodes.UNAUTHORIZED)
    }

    const token = authHeader.split('')[1]

    const checkBlacklist = await Blacklist.findOne({token})

    if(checkBlacklist && !(checkBlacklist === null)){
        throw new customError('You are logged out', StatusCodes.BAD_REQUEST)
    }

    try{
        const payload = jwt.verify(token, process.env.SECRET_KEY)
        req.user = {customerId: payload.customerId, token}
        next()
    }catch(e){
        throw new customError('Authentication Invalid', StatusCodes.UNAUTHORIZED)
    }
}

module.exports = auth