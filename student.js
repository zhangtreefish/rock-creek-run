var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: { type: String, required: true },
    pieces: [{ type: String, ref: 'Piece' }],
    lessons: [{
        length: Number,
        day: String,
        time: String,
        price: Number
    }],
    notes: [{ type: String, ref: 'Note' }]
});

schema.virtual('firstName').get(function() {
    var split = this.name.split(' ');
    return split[0];
});

schema.virtual('lastName').get(function() {
    var split = this.name.split(' ');
    return split.splice(-1).pop();
});

module.exports = schema;
