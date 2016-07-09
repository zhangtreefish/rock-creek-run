//this suite tests Student, Lesson, Product, and Piece Mongoose schemas
var assert = require('assert');
var fs = require('fs');
var mongoose = require('mongoose');
// var pieceSchema = require('./piece');
// var studentSchema = require('./student');
// var lessonSchema = require('./lesson');
var wagner = require('wagner-core');

describe('Mongoose Schemas', function() {
  models = require('./models')(wagner);
  Student = models.Student;
  Piece = models.Piece;
  Lesson = models.Lesson;
  //Product = models.Product;

  //var piece;

  describe('Student', function() {
    var student = new Student(
      { profile:
        {
          username: 'hay rue forest',
          picture: 'http://i.imgur.com/yyR3ZmX.png'
        }
      });

    it('has a `firstName` virtual', function() {
      assert.equal(student.firstName, 'hay');
    });

    it('has a `lastName` virtual', function() {
      student.profile.username = 'dun dee land';
      assert.equal(student.lastName, 'land');
    });
  });

  describe('Piece', function() {
    it('has a title field that is a required string', function(done) {
      var piece = new Piece({});

      piece.validate(function(err) {
        assert.ok(err);
        assert.equal(err.errors['title'].kind, 'required');

        piece.title = 'Rain Song';
        assert.equal(piece.title, 'Rain Song');

        var s = '0123456789';
        piece.title = '';
        while (piece.title.length < 150) {
          piece.title += s;
        }

        piece.validate(function(err) {
          assert.ok(err);
          assert.equal(err.errors['title'].kind, 'maxlength');
        });
      });
      done();
    });

    it('has an genre field that is a required genreSchema', function(done) {
      var piece = new Piece({});

      piece.validate(function(err) {
        assert.ok(err);
        assert.equal(err.errors['genre'].kind, 'required');

        piece.genre = 'Baroque';
        assert.equal(piece.genre, 'Baroque');
      });
      done();
    });
  });

  describe('Lesson', function() {
    it('has a `notes` field containing array of strings', function(done) {
      var lesson = new Lesson({
        date: Date.now,
        notes: ['Record next week'],
        title: "Ballad"
      });

      assert.equal(lesson.notes.length, 1);
      lesson.notes.push('w/ pedal');
      assert.equal(lesson.notes.length, 2);
      assert.equal(lesson.notes[0], 'Record next week');
      assert.equal(lesson.notes[1], 'w/ pedal');
      done();
    });
  });

  //TODO
  // describe('Product', function() {
  //   it('has a `price.amount` subfield of type number', function() {
  //     var product = new Product({
  //       name: 'April Lesson 1',
  //       price: {
  //         amount: 'thirty',
  //         currentcy: 'USD'
  //       }
  //     });

  //     product.validate(function(err) {
  //       assert.ok(err);
  //       assert.equal(err.errors['price']['amount'].kind, 'type');
  //       product.price.amount = 30;
  //       assert.equal(product.price.amount, 30);
  //       done();
  //     });
  //   });
  // });
});
