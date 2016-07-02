var mongodb = require('mongodb');
var uri = 'mongodb://lz:S4M3K4@ds035348.mlab.com:35348/projects';

module.exports = function(callback) {
    mongodb.MongoClient.connect(uri, callback);
};