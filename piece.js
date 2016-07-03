var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    _id: {type: String, required: true},
    title: {type: String, maxlength: 140, required: true},
    composer: {
        name: {type: String, maxlength: 140, required: true},
        years: String
    },
    genre: {type: String, required: true},
    arranger: String,
    book: {type: String, required: true},
    pages: [Number]
});

module.exports = schema;
