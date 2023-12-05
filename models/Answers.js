const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Answers = new Schema({
        currency_id: String,
        answers:  { type: [{
            question_id: {type: String},
            answer: {type: String }
          }]}
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Answers',Answers);
