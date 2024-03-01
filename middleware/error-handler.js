const {StatusCodes} = require('http-status-codes')

const errorHandler = (err, req, res, next)=>{

    let customError = {
        msg: err.message || 'something went wrong try again later',
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    }

    return res.status(customError.statusCode).send({error:{name: err.name, msg: err.msg}})
}

module.exports = errorHandler