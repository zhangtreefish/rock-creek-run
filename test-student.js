var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');
var status = require('http-status');

var URL_ROOT = 'http://localhost:3000';
var PRODUCT_ID = '000000000000000000000001';

describe('Student API', function() {
  var server;
  var Genre;
  var Product;
  var Student;

  before(function() {
    var app = express();

    // Bootstrap server
    var models = require('./models')(wagner);

    // Make models available in tests
    Genre = models.Genre;
    Product = models.Product;
    Student = models.Student;

    app.use(function(req, res, next) {
      Student.findOne({}, function(error, student) {
        assert.ifError(error);
        req.user = student;
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
        done();
      });
    });
  });

  beforeEach(function(done) {
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
    }];


    Product.create(products, function(error) {
      assert.ifError(error);
      Student.create(students, function(error) {
        assert.ifError(error);
        done();
      });
    });
  });

  it('can save students cart', function(done) {
    var url = URL_ROOT + '/me/cart';
    superagent.
      put(url).
      send({
        data: {
          cart: [{ product: PRODUCT_ID, quantity: 1 }]
        }
      }).
      end(function(error, res) {
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

  it('can load students cart', function(done) {
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

