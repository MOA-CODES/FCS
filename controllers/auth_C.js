const Customer = require('../models/customer_M')
const TBlacklist = require('../models/TBlacklist_M')
const {StatusCodes} = require('http-status-codes')
const customError = require('../middleware/customError')

const register = async (req, res)=>{
    const {email, fullname, password} = req.body

    if(!email){
        throw new customError('Provide an email address', StatusCodes.BAD_REQUEST)
    }
    if(!password){
        throw new customError('Provide a Password', StatusCodes.BAD_REQUEST)
    }

    if(!fullname){
        let fname = email.split('@')[0]
        fname = fname.replace("."," ")
    
        req.body.fullname = fname
    }

    const customer = await Customer.create({...req.body})

    const token = customer.createJWT({...req.body})

res.status(StatusCodes.CREATED).json({customer:{_id:customer._id,name:customer.fullname}, token})
}

const login = async (req, res)=>{
    const {email, password} = req.body

    if(!email){
        throw new customError('Provide email', StatusCodes.BAD_REQUEST)
    }
    if(!password){
        throw new customError('Provide Password', StatusCodes.BAD_REQUEST)
    }

    const customer = await Customer.findOne({email, password})

    if(!customer){
        throw new customError('Customer not found', StatusCodes.NOT_FOUND)
    }

   const check = await  customer.comparePSW(password)

   if(!check){
    throw new customError('Invalid Credentials', StatusCodes.UNAUTHORIZED)
   }

   const token = customer.createJWT()
   res.status(StatusCodes.OK).json({login:"successful", token})

}

const logout = async (req, res)=>{

    const {customerId, token} = req.user

    if(!customerId || !token){
        throw new customError('Invalid Authentication', StatusCodes.UNAUTHORIZED)
    }

    const customer = await Customer.findOne({_id:customerId})

    const blacklist = await TBlacklist.create({token})

    res.status(StatusCodes.OK).json({msg:`${customer.fullname} logged out`}) 
}

module.exports = {register, login, logout}