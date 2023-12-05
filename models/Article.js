const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Article = new Schema({
        title: String,
        subtitle: String,
        image: String,
        video_url: String,
        description: String
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Article', Article);
