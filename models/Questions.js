const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Question = new Schema({
        question: String,
        category: String
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Question',Question);
