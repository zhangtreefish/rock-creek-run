var mongoose = require('mongoose');
var genreSchema = require('./genre');

var pieceSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    title: {type: String, maxlength: 140, required: true},
    composer: {
        name: {type: String, maxlength: 140, required: true},
        years: String
    },
    _genre: {type: genreSchema, ref: 'Genre'}, //TODO:what about genre: Genre.genreSchema?
    arranger: String,
    book: {
        title: {type: String, required: true},
        image: {type: String, required: true, match: /^http:\/\//i }
    },
    videos: [String],
    players : [{ type: String, ref: 'Student' }]
});

module.exports = pieceSchema;