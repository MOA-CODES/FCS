const mongoose = require('mongoose');

const fcsSchema = new mongoose.Schema({

    Fee_id: {
        type: String,
        maxlenght: 8,
        minlenght: 8,
        unique: true,
    },
    Fee_currency:{
        type: String,
    },
    Fee_locale:{
        type: String,
    },
    Fee_entity:{
        type: String,
        enum:{
            values:['CREDIT-CARD', 'DEBIT-CARD', 'BANK-ACCOUNT', 'USSD', 'WALLET-ID'],
            message:'{VALUE} is not supported',
        }
    },
    Entity_property:{
        type: String,
    },
    Fee_type:{
        type: String,
        enum:{
            values:['FLAT','PERC','FLAT_PERC'],
            message:'{VALUE} is not supported',
        }
    },
    Fee_value:{
        type: String,
    }

}, {timestamps: true})

module.exports = mongoose.model('FCS', fcsSchema)