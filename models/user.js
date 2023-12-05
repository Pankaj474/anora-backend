const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const Schema = mongoose.Schema;


const User = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: '',
        unique: true
    },
    role: {
        type: String,
        enum: ["admin", "affiliate", "affiliate_manager", "user_tier1", "user_tier2", "user_tier3"]
    },
    username: {
        type: String,
        unique: true
    },
    role: String,
    password: String,
    is_admin: Boolean,
    is_affiliate: Boolean,
    is_verified: false,
    is_delete: {
        type: Boolean,
        default: false
    },
    uniqueurl: {
        type: String,
    },
    paymentMethod: {
        type: String,
        type: ["paypal", "stripe"]
    },
    cardNumber: String,
    avatarUrl: {
        type: String,
        default: '' //We can give some default public url
    },
    videoTitle: {
        type: String,
    },
    videoDescription: {
        type: String,
    },
    videoUrl: {
        type: String,
    },
    videoKeyName: {
        type: String,
    },
    paymentMethod: {
        type: String,
        type: ["paypal", "stripe"]
    },
    cardNumber: String,
    avatarUrl: {
        type: String,
        default: '' //We can give some default public url
    }

},
    {
        timestamps: true
    });

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
