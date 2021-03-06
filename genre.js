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

module.exports = genreSchema;

// module.exports = new mongoose.Schema(genreSchema);
module.exports.genreSchema = genreSchema;
