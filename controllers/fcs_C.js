const Fcs = require('../models/fcs_M')
const {StatusCodes} = require('http-status-codes')
const customError = require('../middleware/customError')
const {getFeeConfig, transactionValidator, computeTransaction} = require('../middleware/Services')
const { all } = require('../routes/fcs_R')

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
        const check = await Fcs.findOne({Fee_currency: FCS_array[i].Fee_currency, Fee_locale: FCS_array[i].Fee_locale, Fee_entity: FCS_array[i].Fee_entity, Entity_property: FCS_array[i].Entity_property, Fee_type: FCS_array[i].Fee_type, Fee_value: FCS_array[i].Fee_value})
        if(check){
            throw new customError(` The fee config that ${FCS_array[i].Fee_id} creates already exists`, StatusCodes.CONFLICT)
        }
        const fcs = await Fcs.create(FCS_array[i]) 
    }

    res.status(StatusCodes.OK).send({msg:"Fee Configuration added successfully", status:"OK"});
}

const getAllFcs = async (req, res) => {
    const {fee_id, fee_currency, fee_locale, fee_entity, entity_property, fee_type, fee_value, page, limit} = req.query

    const queryObject = {}

    if(fee_id){
        queryObject.Fee_id = {$regex: fee_id, $options: 'i'}
    }
    if(fee_currency){
        queryObject.Fee_currency = fee_currency
    }
    if(fee_locale){
        queryObject.Fee_locale = fee_locale
    }

    if(fee_entity){
        queryObject.Fee_entity = fee_entity
    }
    if(entity_property){
        queryObject.Entity_property = {$regex: entity_property, $options: 'i'}
    }
    if(fee_type){
        queryObject.Fee_type = fee_type
    }
    if(fee_value){
        queryObject.Fee_value = fee_value
    }

    const p = Number(page) || 1
    const l = Number(limit) || 3
    const skip = (p-1)*l

    let Fee_Configurations = await Fcs.find(queryObject).select(' Fee_id Fee_currency Fee_locale Fee_entity Entity_property Fee_type Fee_value createdAt').sort('Fee_id').limit(l).skip(skip)    

    res.status(StatusCodes.OK).send({Page_no: p,no_Fcs:Fee_Configurations.length,Fee_Configurations})
}

const TransactionFee = async(req, res) => {

    const transaction = req.body

    const validation = await transactionValidator(transaction)

    if (!(validation === true)){
        throw new customError(validation, StatusCodes.BAD_REQUEST)
    }

    const result = await computeTransaction(transaction)

    if(!(result instanceof Object)){
        throw new customError(result, StatusCodes.NOT_IMPLEMENTED)
    }

    res.status(StatusCodes.OK).send({result})

}

module.exports = {createFCS, TransactionFee, getAllFcs}