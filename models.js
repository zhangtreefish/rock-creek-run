var mongoose = require('mongoose');
var _ = require('underscore');
var pieceSchema = require('./piece');
var studentSchema = require('./student');
var lessonSchema = require('./lesson');
var genreSchema = require('./genre');

module.exports = function(wagner) {
  mongoose.connect('mongodb://localhost:27017/test');

  wagner.factory('db', function() {
    return mongoose;
  });

  var Genre =
    mongoose.model('Genre', genreSchema, 'genres');
  var Student =
    mongoose.model('Student', studentSchema, 'students');
  var Piece = mongoose.model('Piece', pieceSchema, 'pieces');

  var models = {
    Genre: Genre,
    Student: Student,
    Piece: Piece
  };

  // To ensure DRY-ness, register factories in a loop
  _.each(models, function(value, key) {
    wagner.factory(key, function() {
      return value;
    });
  });

  //wagner.factory('Piece', require('./piece'));
  wagner.factory('Product', require('./product'));

  return models;
};
