//this suite tests Student, Lesson, and Piece Mongoose schemas
var assert = require('assert');
var fs = require('fs');
var mongoose = require('mongoose');
var pieceSchema = require('./piece');
var studentSchema = require('./student');
var lessonSchema = require('./lesson');

describe('Mongoose Schemas', function() {
  var Piece = mongoose.model('Piece', pieceSchema, 'pieces');
  var Student = mongoose.model('Student', studentSchema, 'students');
  var succeeded = 0;
  var piece;

  describe('Student', function() {
    it('has a `firstName` virtual', function() {
      var student = new Student({ name: 'Hay Rue Forest' });

      assert.equal(student.firstName, 'Hay');
      ++succeeded;
    });

    it('has a `lastName` virtual', function() {
      var student = new Student({ name: 'Dun Dee Land' });

      assert.equal(student.lastName, 'Land');
      ++succeeded;
    });
  });

  describe('Piece', function() {
    it('has a title field that is a required string', function(done) {
      var piece = new Piece({
        // _id: "certain song",
        // title: "Imagine",
        // composer: {
        //     name: 'J Lenon',
        //     years: '1960?'
        // },
        // _genre: "Contemporary",

        // book: {
        //     title: "that book",
        //     image: "http://i.imgur.com/yyR3ZmX.png"
        // },
      });

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

          ++succeeded;
          done();
        });
      });
    });

    it('has an genre field that is a required string', function(done) {
      var piece = new Piece({});

      piece.validate(function(err) {
        assert.ok(err);
        assert.equal(err.errors['_genre'].kind, 'required');

        piece._genre = 'Indian';
        assert.equal(piece._genre, 'Indian');
        ++succeeded;
        done();
      });
    });

    // it('has a `requirements` field containing array of piece numbers', function() {
    //   piece = new Piece({
    //     _id: 'CS-102',
    //     requirements: ['CS-101']
    //   });

    //   assert.equal(piece.requirements.length, 1);
    //   piece.requirements.push('MATH-101');
    //   assert.equal(piece.requirements.length, 2);
    //   assert.equal(piece.requirements[0], 'CS-101');
    //   assert.equal(piece.requirements[1], 'MATH-101');
    //   ++succeeded;
    // });
  });
});
