var mongoose = require('mongoose');

var pieceSchema = require('./piece');
var lessonSchema = require('./lesson');

var studentSchema = new mongoose.Schema({
    _id: Number,
    name: { type: String, required: true },
    schedule: [{
        length: Number,
        day: String,
        time: String,
        price: Number
    }],
    data: {
        oauth: { type: String, required: true },
        pieces: [pieceSchema],
        lessons: [{type: mongoose.Schema.Types.ObjectId, ref: 'Lesson'}],
        videos: [{type: String, match: /^http:\/\//i}],
        cart: [{
            product: {
                type: mongoose.Schema.Types.ObjectId
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1
            }
        }]
    }
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
