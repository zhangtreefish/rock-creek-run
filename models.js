var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
  mongoose.connect('mongodb://localhost:27017/test');

  wagner.factory('db', function() {
    return mongoose;
  });

  var Genre =
    mongoose.model('Genre', require('./genre'), 'genres');
  var Student =
    mongoose.model('Student', require('./student'), 'students');

  var models = {
    Genre: Genre,
    Student: Student
  };

  // To ensure DRY-ness, register factories in a loop
  _.each(models, function(value, key) {
    wagner.factory(key, function() {
      return value;
    });
  });

  wagner.factory('Piece', require('./piece'));
  wagner.factory('Product', require('./product'));

  return models;
};
