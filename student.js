var mongoose = require('mongoose');

var pieceSchema = require('./piece');
var lessonSchema = require('./lesson');

var studentSchema = new mongoose.Schema({
    _id: Number,
    profile: {
        username: {
          type: String,
          required: true,
          lowercase: true
        },
        picture: {
          type: String,
          required: true,
          match: /^http:\/\//i
        }
    },
    schedule: [{
        length: Number,
        day: String,
        time: String,
        price: Number
    }],
    data: {
        oauth: { type: String, required: true },
        pieces: [{type: mongoose.Schema.Types.ObjectId, ref: 'piece'}],
        lessons: [lessonSchema],
        cart: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
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
    var split = this.profile.username.split(' ');
    return split[0];
});

studentSchema.virtual('lastName').get(function() {
    var split = this.profile.username.split(' ');
    return split.splice(-1).pop();
});

module.exports = studentSchema;
