var assert = require('assert');
var connect = require('./connect');
var rockCreekRunInterface = require('./interface');
var fs = require('fs');
var repertoire = require('./pieces.json');  //normally would be named 'pieces'

//This test suite tests rockCreekRunInterface
describe('rockCreekRunInterface', function() {
    var db;
    var succeeded = 0;
    var classicalPieces;

    it('can insert a piece', function(done) {
        var doc = {
            title: 'Kawasaki Disease',
            composer: {
                name: 'Treefish',
                years: ''
            },
            genre: 'Nerdy',
            arranger: '',
            book: '',
            pages: [],
        };
        rockCreekRunInterface.insert(db, doc, function(error) {
            assert.ifError(error);
            db.collection('repertoire').count({ title: 'Kawasaki Disease' }, function(error, c) {
                assert.ifError(error);
                assert.equal(c, 1);
                done();
            });
        });
    });

    //This test ensures that interface.js' `byGenre()` function can load document(s).
    it('can query data by Genre', function(done) {
        rockCreekRunInterface.byGenre(db, 'Nerdy', function(error, docs) {
            assert.ifError(error);
            assert.ok(Array.isArray(docs));
            assert.equal(docs.length, 1);
            assert.equal(docs[0].title, 'Kawasaki Disease');
            ++succeeded;
            done();
        });
    });

    //This test ensures that interface.js' `byGenre()` function loads
    //pieces in ascending order by their composer's years, at least
    //in lexicographic order.
    it('returns multiple results ordered by title', function(done) {
        rockCreekRunInterface.byGenre(db, 'Classical', function(error, docs) {
            assert.ifError(error);
            assert.ok(Array.isArray(docs));
            assert.equal(docs.length, 2);
            assert.equal(docs[0].title, 'Sonatina, Op. 36, No. 1');
            assert.equal(docs[1].title, 'Ballad');

            docs.forEach(function(doc) {
                delete doc._id;
            });
            assert.deepEqual(Object.keys(docs[0]), ['title', 'composer', 'genre', 'arranger', 'book', 'pages']);
            ++succeeded;
            classicalPieces = docs;
            done();
        });
    });

    //This function does some basic setup work to make sure you have the correct
    // data in your "repertoire" collection.
    before(function(done) {
        connect(function(error, conn) {
            if (error) {
                return done(error);
            }
            db = conn;
            db.collection('repertoire').remove({}, function(error) {
                if (error) {
                    return done(error);
                }

                var fns = [];
                repertoire.pieces.forEach(function(piece) {
                    fns.push(function(callback) {
                        rockCreekRunInterface.insert(db, piece, callback);
                    });
                });
                require('async').parallel(fns, done);
            });
        });
    });
});

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

          ++succeeded;
          done();
        });
      });
    });

    it('has an genre field that is a required string', function(done) {
      var piece = new Piece({});

      piece.validate(function(err) {
        assert.ok(err);
        assert.equal(err.errors['genre'].kind, 'required');

        piece.genre = 'Indian';
        assert.equal(piece.genre, 'Indian');
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
