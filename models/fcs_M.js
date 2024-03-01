const mongoose = require('mongoose');

const fcsSchema = new mongooseSchema({

    Fee_id: {
        type: String,
        maxlenght: 8,
        minlenght: 8,
    },
    Fee_currency:{
        type: String,
    },
    Fee_locale:{
        type: String,
    },
    Fee_entity:{
        type: String,
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