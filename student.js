var mongoose = require('mongoose');

var pieceSchema = require('./piece');
var lessonSchema = require('./lesson');

var studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    schedule: [{
        length: Number,
        day: String,
        time: String,
        price: Number
    }],
    pieces: [pieceSchema],
    lessons: [lessonSchema]
});

studentSchema.virtual('firstName').get(function() {
    var split = this.name.split(' ');
    return split[0];
});

studentSchema.virtual('lastName').get(function() {
    var split = this.name.split(' ');
    return split.splice(-1).pop();
});

module.exports = studentSchema;
