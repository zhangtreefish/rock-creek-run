var mongoose = require('mongoose');
var fx = require('./fx');

// module.exports = function(db, fx) {
  var productSchema = new mongoose.Schema ({
    name: { type: String, required: true },
    price: {
      amount: {
        type: Number,
        // required: true,
        set: function(v) {
          this.internal.approximatePriceUSD =
            v / (fx()[this.price.currency] || 1);
          return v;
        }
      },
      currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP'],
        // required: true,
        set: function(v) {
          this.internal.approximatePriceUSD =
            this.price.amount / (fx()[v] || 1);
          return v;
        }
      }
    },
    internal: {
      approximatePriceUSD: Number
    }
  });

  // var productSchema = new mongoose.Schema(productSchema);

  var currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  };

  /*
   * Human-readable string form of price - "$25" rather
   * than "25 USD"
   */
  productSchema.virtual('displayPrice').get(function() {
    return currencySymbols[this.price.currency] +
      '' + this.price.amount;
  });

  productSchema.set('toObject', { virtuals: true });
  productSchema.set('toJSON', { virtuals: true });

  // return db.model('Product', schema, 'products');
// };
  module.exports = productSchema;
