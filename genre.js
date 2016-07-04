var mongoose = require('mongoose');

var genreSchema = new mongoose.Schema({
    _id: { type: String },
    parent: {
        type: String,
        ref: 'Genre'
    },
    ancestors: [{
        type: String,
        ref: 'Genre'
    }]
});

module.exports.genreSchema = genreSchema;

// module.exports = new mongoose.Schema(categorySchema);
// module.exports.categorySchema = categorySchema;
