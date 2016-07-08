var mongoose = require('mongoose');
var studentSchema = require('./student');

var lessonSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now, required: true},
    student: {type: mongoose.Schema.Types.ObjectId, ref: 'student', required: true},
    piece: {type: mongoose.Schema.Types.ObjectId, ref: 'piece', required: true},
    pages: [Number],
    notes: [{
        type: String,
        enum : ['Do < >','Polishing loud and soft @ m___', 'Record next week', 'Crispness m___', 'w/ pedal',
        'Key signature is ', 'fix rh __ note on p __ m___',
        'sneaky soft on p __ m___', 'connect rh notes on p __ m___'],
        default : 'Do < >'
    }]
});

module.exports =lessonSchema;
