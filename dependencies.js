var fs = require('fs');
var fx = require('./fx');
var Stripe = require('stripe');
var wagner = require('wagner-core');

module.exports = function(wagner) {
  var stripe = wagner.factory('Stripe', function() {
    return Stripe(wagner.invoke(function(Config) {
        return Config;
      }).stripeKey
    );
  });

  wagner.factory('fx', fx);

  wagner.factory('Config', function() {
    return JSON.parse(fs.readFileSync('./config.json').toString());
  });
};
