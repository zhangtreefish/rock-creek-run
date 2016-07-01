var _ = require('underscore');
_.each([1,2,3], function(v){
	console.log(v);
});

// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
//MongoClient.connect("mongodb://lz:S4M3K4@ds035348.mlab.com:35348/projects", function(err, db) {
  	if(err) {
     	console.log("error at connect", err);
     	process.exit(1);
	}
    db.collection('sample').insert({id:"number 1"}, function(err, result) {
    	if(err){
    		console.log('err at insert', err);
    		process.exit(1);
    	}
    	db.collection('sample').find().toArray(function(err, docs) {
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