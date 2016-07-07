var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';

describe('Genre API', function() {
  var server;
  var Genre;
  var Piece;

  before(function() {
    var app = express();

    // Bootstrap server
    var models = require('./models')(wagner);
    app.use(require('./api')(wagner));

    server = app.listen(3000);

    // Make Genre model available in tests
    Genre = models.Genre;
    Piece = models.Piece;
  });

  after(function() {
    // Shut the server down when we're done
    server.close();
  });

  beforeEach(function(done) {
    // Make sure categories are empty before each test
    Genre.remove({}, function(error) {
      assert.ifError(error);
      Piece.remove({}, function(error) {
        assert.ifError(error);
        done();
      });
    });
  });

  it('can load a genre by id', function(done) {
    // Create a single genre
    Genre.create({ _id: 'New Age' }, function(error, doc) {
      assert.ifError(error);
      var url = URL_ROOT + '/genre/id/New Age';
      // Make an HTTP request to localhost:3000/genre/id/New Age
      superagent.get(url, function(error, res) {
        assert.ifError(error);
        var result;
        // And make sure we got { _id: 'New Age' } back
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result.genre);
        assert.equal(result.genre._id, 'New Age');
      });
    });
    done();
  });

  it('can load all genres that have a certain parent', function(done) {
    var genres = [
      { _id: 'New Age' },
      { _id: 'new sound', parent: 'New_Age' },
      { _id: 'odd sound', parent: 'New_Age' },
      { _id: 'Bacon' }
    ];

    // Create 4 genres
    Genre.create(genres, function(error, genres) {
      var url = URL_ROOT + '/genre/parent/New_Age';

      superagent.get(url, function(error, res) {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.equal(result.genres.length, 2);
        // Should be in ascending order by _id
        assert.equal(result.genres[0]._id, 'new sound');
        assert.equal(result.genres[1]._id, 'odd sound');
       });
    });
    done();
  });
  //TODO
  // it('can load a piece by id', function(done) {
  //   // Create a single piece
  //   var PIECE_ID = 'first';
  //   var piece = {
  //     id: PIECE_ID,
  //     title: "Imagine",
  //     composer: {
  //         name: 'J Lenon',
  //         years: '1960?'
  //     },
  //     _genre: "Contemporary",
  //     book: {
  //         title: "that book",
  //         image: "http://i.imgur.com/yyR3ZmX.png"
  //     }
  //   };
  //   Piece.create(piece, function(error, doc) {
  //     assert.ifError(error);
  //     var url = URL_ROOT + '/piece/id/' + PIECE_ID;

  //     superagent.get(url, function(error, res) {
  //       assert.ifError(error);
  //       var result;
  //       assert.doesNotThrow(function() {
  //         result = JSON.parse(res.text);
  //       });
  //       assert.ok(result.piece);
  //       assert.equal(result.piece.id, PIECE_ID);
  //       assert.equal(result.piece.title, 'Imagine');
  //       done();
  //     });
  //   });
  // });
});
