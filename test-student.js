var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');
var status = require('http-status');
var mongoose = require('mongoose');

var URL_ROOT = 'http://localhost:3000';
var PRODUCT_ID = '000000000000000000000001';

describe('API', function() {
  var server;
  var Genre;
  var Product;
  var Student;
  var Stripe;
  var Piece;

  var products = [
    {
      name: '30-minute weekly lesson'
      //the following fails validation:
      // name: '30-minute weekly lesson',
      // price: {
      //   amount: 300,
      //   currency: 'USD'
      // }
    },
    {
      _id: PRODUCT_ID,
      // name: '45-minute weekly lesson',
      // price: {
      //   amount: 2000,
      //   currency: 'USD'
      // }
      name: '45-minute weekly lesson'
    },
    {
      name: 'Book'
      // name: 'Book',
      // price: {
      //   amount: 20,
      //   currency: 'USD'
      // }
    }
  ];

  var students = [
    {
      _id: 003,
      profile: {
        username: 'treefish',
        picture: 'http://i.imgur.com/yyR3ZmX.png'
      },
      data: {
        oauth: 'invalid',
        cart: []
      }
    }
  ];

  var genres = [
    { _id: 'Piano', ancestors: ['Piano'] },
    { _id: 'Classical', ancestors: ['Piano', 'Classical'] },
    { _id: 'Baroque', ancestors: ['Piano', 'Baroque'] },
    { _id: 'Vocal', ancestors: ['Vocal'] }
  ];
  var id1 = new mongoose.Types.ObjectId,
      id2 = new mongoose.Types.ObjectId;

  var pieces = [
    {
      title: "Menuet",
      composer:  {
          name: "J.S. Bach",
          years: "1685-1750"
      },
      genre: id1,
      book: {
        title: "J.S. Bach, Selections from Anna Magalena's Notebook, Edited by Willard A. Palmer",
        image: "http://i.imgur.com/yyR3ZmX.png"
      }
    },
    {
      title: "Sonatina, Op. 36, No. 1",
      composer: {
          name: "Muzio Clementi",
          years: "1752-1832"
      },
      genre: id2,
      book: {
        title: "Artist Piece Sonatinas, Book Two Intermediate, Compiled and edited by Nancy and Randall Faber",
        image: "http://i.imgur.com/yyR3ZmX.png"
      }
    }
  ];

  before(function() {
    var app = express();

    // Bootstrap server
    var models = require('./models')(wagner);
    var dependencies = require('./dependencies')(wagner);

    // Make models available in tests
    Genre = models.Genre;
    Product = models.Product;
    Student = models.Student;
    Piece = models.Piece;
    Stripe = dependencies.Stripe;

    app.use(function(req, res, next) {
      Student.findOne({}, function(error, student) {
        assert.ifError(error);
        req.student = student;
        next();
      });
    });

    app.use(require('./api')(wagner));

    server = app.listen(3000);
  });

  after(function() {
    // Shut the server down when we're done
    server.close();
  });

  beforeEach(function(done) {
    // Make sure categories are empty before each test
    Product.remove({}, function(error) {
      assert.ifError(error);
      Student.remove({}, function(error) {
        assert.ifError(error);
      });
    });

    Genre.remove({}, function(error) {
      assert.ifError(error);
      Piece.remove({}, function(error) {
        assert.ifError(error);
        done();
      });
    });
  });

  it('can save students cart', function(done) {
    Product.create(products, function(error) {
      assert.ifError(error);
      Student.create(students, function(error) {
        assert.ifError(error);

        var url = URL_ROOT + '/me/cart';
        superagent.put(url).send({
          data: {
            cart: [{ product: PRODUCT_ID, quantity: 1 }]
          }
        }).end(function(error, res) {
          assert.ifError(error);
          assert.equal(res.status, status.OK);
          Student.findOne({}, function(error, student) {
            assert.ifError(error);
            assert.equal(student.data.cart.length, 1);
            assert.equal(student.data.cart[0].product, PRODUCT_ID);
            assert.equal(student.data.cart[0].quantity, 1);
            done();
          });
        });
      });
    });
  });

  it('can load students cart', function(done) {
    Product.create(products, function(error) {
      assert.ifError(error);
      Student.create(students, function(error) {
        assert.ifError(error);

        var url = URL_ROOT + '/me';

        Student.findOne({}, function(error, student) {
          assert.ifError(error);
          student.data.cart = [{ product: PRODUCT_ID, quantity: 1 }];
          student.save(function(error) {
            assert.ifError(error);

            superagent.get(url, function(error, res) {
              assert.ifError(error);

              assert.equal(res.status, 200);
              var result;
              assert.doesNotThrow(function() {
                result = JSON.parse(res.text).student;  //The res.text property contains the unparsed response body string
              });
              assert.equal(result.data.cart.length, 1);
              assert.equal(result.data.cart[0].product.name, '45-minute weekly lesson');
              assert.equal(result.data.cart[0].quantity, 1);
              done();
            });
          });
        });
      });
    });
  });

  it('can load a genre by id', function(done) {
    Genre.create({ _id: 'New Age' }, function(error, doc) {
      assert.ifError(error);
      var url = URL_ROOT + '/genre/id/New Age';

      superagent.get(url, function(error, res) {
        assert.ifError(error);
        var result;
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
    Genre.create(genres, function(error, genres) {
      var url = URL_ROOT + '/genre/parent/Piano';

      superagent.get(url, function(error, res) {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.equal(result.genres.length, 2);
        // Should be in ascending order by _id
        assert.equal(result.genres[0]._id, 'Baroque');
        assert.equal(result.genres[1]._id, 'Classical');
       });
    });
    done();
  });

  it('can search by text', function(done) {
    Genre.create(genres, function(error, genres) {
      assert.ifError(error);
      Piece.create(pieces, function(error, pieces) {
        assert.ifError(error);
        var url = URL_ROOT + '/piece/text/menuet';
        // Get piece
        superagent.get(url, function(error, res) {
          assert.ifError(error);
          assert.equal(res.status, status.OK);

          var results;
          assert.doesNotThrow(function() {
            results = JSON.parse(res.text).pieces;
          });

          // Expect that we got the piece back
          assert.equal(results[0].title, 'menuet');
          done();
        });
      });
    });
  });

  //TODO: showes on api, but assertion error in test
  it('can load all pieces in a genre with sub-genres', function(done) {
    Genre.create(genres, function(error, genres) {
      assert.ifError(error);
      Piece.create(pieces, function(error, pieces) {
        assert.ifError(error);
        var url = URL_ROOT + '/piece/genre/Piano';
        // Make an HTTP request to localhost:3000/piece/ancestor/Piano
        superagent.get(url, function(error, res) {
          assert.ifError(error);
          var result;
          assert.doesNotThrow(function() {
            result = JSON.parse(res.text);
          });
          assert.equal(result.pieces.length, 2);
          // Should be in ascending order by title
          assert.equal(result.pieces[0].title, 'Menuet');
          assert.equal(result.pieces[1].title, 'Sonatina, Op. 36, No. 1');
        });
      });
    });
  });

  //TODO: api works, but here test not
  it('can load a piece by id', function(done) {
    // Create a single piece
    var PIECE_ID = '000000000000000000000001';
    var my_id = new mongoose.Types.ObjectId;
    var my_genre = { _id: 'Piano', ancestors: ['Piano'] };

    // var piece = {
    //   _id: PIECE_ID,
    //   title: "Imagine",
    //   composer: {
    //       title: 'J Lenon'
    //   },
    //   // genre: my_id,
    //   book: {
    //       title: "that book",
    //       image: "http://i.imgur.com/yyR3ZmX.png"
    //   }
    // };

    //piece.Genre = genre;
    // insert genre before testing piece insertion
    Genre.create(my_genre, function(error, doc) {
      assert.ifError(error);

      var piece = {
        _id: PIECE_ID,
        title: "Imagine",
        composer: {
            title: 'J Lenon'
        },
        genre: doc.id,
        book: {
            title: "that book",
            image: "http://i.imgur.com/yyR3ZmX.png"
        }
      };

      Piece.create(piece, function(error, doc) {
        assert.ifError(error);
        var url = URL_ROOT + '/piece/id/' + PIECE_ID;

        superagent.get(url, function(error, res) {
          assert.ifError(error);
          var result;
          assert.doesNotThrow(function() {
            result = JSON.parse(res.text);
          });
          assert.ok(result.piece);
          assert.equal(result.piece.id, PIECE_ID);
          assert.equal(result.piece.title, 'Imagine');
          done();
        });
      });  // Piece
    });  //Genre
  });
});
