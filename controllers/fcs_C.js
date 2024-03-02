const Fcs = require('../models/fcs_M')
const {StatusCodes} = require('http-status-codes')
const customError = require('../middleware/customError')
const {getFeeConfig} = require('../middleware/Services')

const createFCS = async (req, res) =>{

    const {FeeConfigurationSpec} = req.body

    if(!FeeConfigurationSpec){
        throw new customError('Provide FeeConfigurationSpec data ',StatusCodes.BAD_REQUEST)
    }

    const FCS_array = await getFeeConfig(FeeConfigurationSpec)
    
    if(!(Array.isArray(FCS_array))){//if not an array then its a text explaining the error type
        throw new customError(FCS_array, StatusCodes.BAD_REQUEST)
    }

    for(let i=0; i<FCS_array.length; i++){
        const fcs = await Fcs.create(FCS_array[i]) 
    }

    res.status(StatusCodes.OK).send({msg:"Fee Configuration added successfully", status:"OK"});

}

module.exports = {createFCS}