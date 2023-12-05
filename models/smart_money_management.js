const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SmartMoneyManagement = new Schema({
        public_address: String,
        name: String,
        is_deleted: {type:Boolean, default: false}
    },{ 
        timestamps: true 
    }
);

module.exports = mongoose.model('SmartMoneyManagement', SmartMoneyManagement);
