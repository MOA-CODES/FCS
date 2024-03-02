const customError = require('../middleware/customError')
const {StatusCodes} = require('http-status-codes')

const test = "LNPY1221 NGN * *(*) : APPLY PERC 1.4\n\
              LNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\n\
              LNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\n\
              LNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\n\
              LNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55" //test data

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

module.exports = {getFeeConfig}