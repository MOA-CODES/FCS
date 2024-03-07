const customError = require('../middleware/customError')
const {StatusCodes} = require('http-status-codes')
const Fcs = require('../models/fcs_M')

const getFeeConfig = async (text) =>{
    const FCS_array = []
    const Tlength = text.split('\n').length

    for(let i=0; i<Tlength; i++){
        let FCS = {}

        let currentRow = text.split('\n')[i].trimStart();

        if(!(currentRow.split(' ').length === 8)){ // if currentrow index length doesn't == 8, its likely wrong syntax
            return 'Invalid FeeConfiguration Syntax'
        }

        
        FCS.Fee_id = currentRow.split(' ')[0]
        if(FCS.Fee_id === null || FCS.Fee_id === undefined || FCS.Fee_id === ''){ //if null or undefined or '', throw an error
            return `Provide a FEE-ID on row ${i}`
        }
        if(!(FCS.Fee_id.length === 8)){
            return `Provide a valid FEE-ID on row ${i}`
        }

        FCS.Fee_currency = currentRow.split(' ')[1]
        if(FCS.Fee_currency === null || FCS.Fee_currency === undefined || FCS.Fee_currency === ''){
            return `Provide a FEE-CURRENCY on row ${i}`
        }

        FCS.Fee_locale = currentRow.split(' ')[2]
        if(FCS.Fee_locale === null || FCS.Fee_locale === undefined || FCS.Fee_locale === ''){
            return `Provide a FEE-LOCALE on row ${i}`
        }

        FCS.Fee_entity = currentRow.split(' ')[3].split('(')[0]
        if(FCS.Fee_entity === null || FCS.Fee_entity === undefined || FCS.Fee_entity === ''){
            return `Provide a FEE-ENTITY on row ${i}`
        }

        FCS.Entity_property = currentRow.split(' ')[3].split('(')[1].replace(")","")
        if(FCS.Entity_property === null || FCS.Entity_property === undefined || FCS.Entity_property === ''){
            return `Provide a FEE-PROPERTY on row ${i}`
        }

        FCS.Fee_type = currentRow.split(' ')[6]
        if(FCS.Fee_type === null || FCS.Fee_type === undefined || FCS.Fee_type === ''){
            return `Provide a FEE-TYPE on row ${i}`
        }

        FCS.Fee_value = currentRow.split(' ')[7]
        if(FCS.Fee_value === null || FCS.Fee_value === undefined || FCS.Fee_value === ''){
            return `Provide a FEE-VALUE on row ${i}`
        }

        FCS_array.push(FCS)
    }
    return FCS_array
}

const transactionValidator = async (transaction)=>{
  if (!Object.keys(transaction).length === 6){
        return 'Invalid Transaction Syntax'
  }

    if(!transaction.ID){
        return 'Invalid Transaction Syntax Provide transaction ID'
    }
    if(!transaction.Amount){
        return 'Invalid Transaction Syntax Provide transaction Amount'
    }
    if(!transaction.Currency){
        return 'Invalid Transaction Syntax Provide transaction Currency'
    }
    if(!transaction.CurrencyCountry){
        return 'Invalid Transaction Syntax Provide transaction CurrencyCountry'
    }

    //CUSTOMER
    if(!(Object.keys(transaction.Customer).length === 4)){
        return 'Invalid Transaction Customer Syntax'
    }
    if(!transaction.Customer.ID ){
        return 'Invalid Transaction Customer Syntax Provide ID'
    }
    if(!transaction.Customer.EmailAddress ){
        return 'Invalid Transaction Customer Syntax Provide EmailAddress'
    }
    if(!transaction.Customer.FullName ){
        return 'Invalid Transaction Customer Syntax Provide FullName'
    }
    if(!transaction.Customer.BearsFee ){
        return 'Invalid Transaction Customer Syntax Provide BearsFee'
    }

    //PaymentEntity
    if(!(Object.keys(transaction.PaymentEntity).length === 7)){
        return 'Invalid Transaction PaymentEntity Syntax'
    }
    if(!transaction.PaymentEntity.ID ){
        return 'Invalid Transaction PaymentEntity Syntax Provide ID'
    }
    if(!transaction.PaymentEntity.Issuer ){
        return 'Invalid Transaction PaymentEntity Syntax Provide Issuer'
    }
    if(!transaction.PaymentEntity.Brand ){
        return 'Invalid Transaction PaymentEntity Syntax Provide Brand'
    }
    if(!transaction.PaymentEntity.Number ){
        return 'Invalid Transaction PaymentEntity Syntax Provide Number'
    }
    if(!transaction.PaymentEntity.SixID ){
        return 'Invalid Transaction PaymentEntity Syntax Provide SixID'
    }
    if(!transaction.PaymentEntity.Type ){
        return 'Invalid Transaction PaymentEntity Syntax Provide Type'
    }
    if(!transaction.PaymentEntity.Country ){
        return 'Invalid Transaction PaymentEntity Syntax Provide Country'
    }

    return true
}

const computeTransaction = async (transaction)=>{
    const {Brand, Type, Country} = transaction.PaymentEntity
    const {Amount, CurrencyCountry} = transaction
    const {BearsFee} = transaction.Customer //if false then chargedamount = transaction amount

    //find applicable FCS
    let FCSquery = {}

    if(!(Country === CurrencyCountry)){
        FCSquery.Fee_locale = "INTL"
    }else{
        FCSquery.Fee_locale = "LOCL"
    }

    FCSquery.Fee_entity = Type
    FCSquery.Entity_property = Brand

    let fcs = await Fcs.find({FCSquery})

    if(!fcs || fcs.length === 0){ //if exact match cant be found search for all entity property
        fcs = await Fcs.findOne({Fee_locale: FCSquery.Fee_locale,Fee_entity: FCSquery.Fee_entity,Entity_property: '*'})
    } 
    else if(!fcs || fcs.length === 0){ //if previous match cant be found search for all fee locale
        fcs = await Fcs.findOne({Fee_locale: '*',Fee_entity: FCSquery.Fee_entity,Entity_property:FCSquery.Entity_property})
    }
    else if(!fcs || fcs.length === 0){ //if previous match cant be found search for all fee locale and fee entity
        fcs = await Fcs.findOne({Fee_locale: '*',Fee_entity: FCSquery.Fee_entity,Entity_property: '*'})
    }
    if(fcs === null){
        return 'no fee configuration spec exists for this transaction'
    }

    //reponse
    let rep = {}

    rep.AppliedFeeID = fcs.Fee_id
    rep.AppliedFeeValue =  await calculateFee(Amount, fcs.Fee_type, fcs.Fee_value) //calculates the fee
    rep.ChargeAmount = parseFloat(Amount) + parseFloat(rep.AppliedFeeValue)
    rep.SettlementAmount = parseFloat(rep.ChargeAmount) - parseFloat(rep.AppliedFeeValue)

    return rep
}

const calculateFee = async (amount,fee_type,fee_value)=>{
    //'FLAT','PERC','FLAT_PERC'
    if(fee_type === 'FLAT'){
        fee_value = parseFloat(fee_value)
        return parseFloat(fee_value)
    }
    if(fee_type === 'PERC'){
        fee_value = parseFloat(fee_value)
        return ((fee_value/100)*amount)
    }
    if(fee_type === 'FLAT_PERC'){
        const flat = parseFloat(fee_value.split(':')[0])
        const perc = parseFloat(fee_value.split(':')[1])

        return flat + ((perc/100)*amount)
    }
}


module.exports = {getFeeConfig, transactionValidator, computeTransaction}