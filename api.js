var express = require('express');
var status = require('http-status');
var bodyparser = require('body-parser');
var _ = require('underscore');

module.exports = function(wagner) {
  var api = express.Router();

  api.get('/genre/id/:id', wagner.invoke(function(Genre) {
    return function(req, res) {
      Genre.findOne({ _id: req.params.id }, function(error, genre) {
        if (error) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
        }
        if (!genre) {
          return res.
            status(status.NOT_FOUND).
            json({ error: 'Not found' });
        }
        res.json({ genre: genre });
      });
    };
  }));

  api.get('/genre/parent/:id', wagner.invoke(function(Genre) {
    return function(req, res) {
      Genre.
        find({ parent: req.params.id }).
        sort({ _id: 1 }).
        exec(function(error, genres) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          res.json({ genres: genres });
        });
    };
  }));
  //piece api, use id =000000000000000000000001
  api.get('/piece/id/:id', wagner.invoke(function(Piece) {
    return function(req, res) {
      Piece.findOne({ _id: req.params.id },
        handleOne.bind(null, 'piece', res));
    };
  }));

  // TODO: for sorting:var sort = { composer.name: 1 };// sort(sort).
  api.get('/piece/genre/:id', wagner.invoke(function(Piece) {
    return function(req, res) {
      Piece.
        find({ 'genre.ancestors': req.params.id }).
        exec(handleMany.bind(null, 'pieces', res));
    };
  }));

  api.get('/piece/text/:query', wagner.invoke(function(Piece) {
    return function(req, res) {
      Piece.
        find(
          { $text : { $search : req.params.query } },
          { score : { $meta: 'textScore' } }).
        sort({ score: { $meta : 'textScore' } }).
        limit(10).
        exec(handleMany.bind(null, 'pieces', res));
    };
  }));

//student api
  api.use(bodyparser.json());

  api.put('/me/cart', wagner.invoke(function(Student) {
    return function(req, res) {
      try {
        var cart = req.body.data.cart;
      } catch(e) {
        return res.
          status(status.BAD_REQUEST).
          json({ error: 'No cart specified!' });
      }

      req.student.data.cart = cart;
      req.student.save(function(error, student) {
        if (error) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
        }
        return res.json({ student: student });
      });
    };
  }));

  api.get('/me', function(req, res) {
    if (!req.student) {
      return res.
        status(status.UNAUTHORIZED).
        json({ error: 'Not logged in' });
    }

    req.student.populate(
      { path: 'data.cart.product', model: 'Product' },
      handleOne.bind(null, 'student', res));
  });

  api.post('/checkout', wagner.invoke(function(Student, Stripe) {
    return function(req, res) {
      if (!req.student) {
        return res.
          status(status.UNAUTHORIZED).
          json({ error: 'Not logged in' });
      }

      // Populate the products in the student's cart
      req.student.populate({ path: 'data.cart.product', model: 'Product' }, function(error, student) {

        // Sum up the total price in USD
        var totalCostUSD = 0;
        _.each(student.data.cart, function(item) {
          totalCostUSD += item.product.internal.approximatePriceUSD *
            item.quantity;
        });

        // And create a charge in Stripe corresponding to the price
        Stripe.charges.create(
          {
            // Stripe wants price in cents, so multiply by 100 and round up
            amount: Math.ceil(totalCostUSD * 100),
            currency: 'usd',
            source: req.body.stripeToken,
            description: 'Example charge'
          },
          function(err, charge) {
            if (err && err.type === 'StripeCardError') {
              return res.
                status(status.BAD_REQUEST).
                json({ error: err.toString() });
            }
            if (err) {
              console.log(err);
              return res.
                status(status.INTERNAL_SERVER_ERROR).
                json({ error: err.toString() });
            }

            req.student.data.cart = [];
            req.student.save(function() {
              // Ignore any errors - if we failed to empty the student's
              // cart, that's not necessarily a failure

              // If successful, return the charge id
              return res.json({ id: charge.id });
            });
          });
      });
    };
  }));

  return api;
};

function handleOne(property, res, error, result) {
  if (error) {
    return res.
      status(status.INTERNAL_SERVER_ERROR).
      json({ error: error.toString() });
  }
  if (!result) {
    return res.
      status(status.NOT_FOUND).
      json({ error: 'Result not found' });
  }

  var json = {};
  json[property] = result;
  res.json(json);
}

function handleMany(property, res, error, result) {
  if (error) {
    return res.
      status(status.INTERNAL_SERVER_ERROR).
      json({ error: error.toString() });
  }

  var json = {};
  json[property] = result;
  res.json(json);
}

