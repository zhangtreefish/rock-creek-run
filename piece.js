var mongoose = require('mongoose');
var Genre = require('./genre');

var pieceSchema = new mongoose.Schema({
    // id: {type: String, required: true},
    title: {type: String, maxlength: 140, required: true},
    composer: {
        name: {type: String, maxlength: 140, required: true},
        years: String
    },
    //genre: Genre.genreSchema,
    genre: {type: mongoose.Schema.Types.ObjectId, ref: 'genre', required: true}, //TODO:what about genre: Genre.genreSchema?{type: genreSchema, ref: 'Genre'}
    //genre: genreSchema,//TypeError: Undefined type `undefined` at `genre`;Did you try nesting Schemas? You can only nest using refs or arrays.
    arranger: String,
    book: {
        title: {type: String, required: true},
        image: {type: String, required: true, match: /^http:\/\//i }
    },
    videos: [{type: String, match: /^http:\/\//i}]
});

module.exports = pieceSchema;
