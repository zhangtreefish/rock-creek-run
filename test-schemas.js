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
    it('has a `firstName` virtual', function() {
      var student = new Student({ name: 'Hay Rue Forest' });
      assert.equal(student.firstName, 'Hay');
    });

    it('has a `lastName` virtual', function() {
      var student = new Student({ name: 'Dun Dee Land' });
      assert.equal(student.lastName, 'Land');
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

        piece.genre = 'Indian';
        assert.equal(piece.genre, 'Indian');
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
