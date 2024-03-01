const Customer = require('../models/customer_M')
const {StatusCodes} = require('http-status-codes')
const customError = require('../middleware/customError')

const register = async (req, res)=>{

    const customer = await Customer.create({...req.body})

    const token = user.createJWT({...req.body})

res.status(StatusCodes.CREATED).json({user: {_id: user._id, name:customer.fullname}, token})

}

const login = async (req, res)=>{

}

const logout = async (req, res)=>{

}

module.exports = {register, login, logout}