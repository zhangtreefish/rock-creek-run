var _ = require('underscore');
var pieces = require('./pieces.json');

var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://lz:S4M3K4@ds035348.mlab.com:35348/projects", function(err, db) {
  	if(err) {
     	console.log("error at connect", err);
     	process.exit(1);
	}

	//db.collection('repertoire').remove();
	//db.collection('repertoire').createIndex({"title": 1}, { "unique": true });
    db.collection('repertoire').insertMany(pieces.pieces, function(err, result) {
    	if(err){
    		console.log('err at insert', err);
    		process.exit(1);
    	}
    	var query = { 'composer.name': 'John Williams'};
    	db.collection('repertoire').find(query).toArray(function(err, docs) {
    		if(err){
	    		console.log('err at find', err);
	    		process.exit(1);
	    	}
	    	docs.forEach(function(doc) {
	    		console.log('doc', JSON.stringify(doc));
	    	});
	    	process.exit(0);
    	});
    });
});