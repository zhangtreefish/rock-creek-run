var _ = require('underscore');
_.each([1,2,3], function(v){
	console.log(v);
});

// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  	if(!err) {
     	console.log("We are connected");
     	process.exit(1);
	}
    db.collection('sample').insert({id:"number 1"}, function(err, result) {
    	if(err){
    		console.log('err', err);
    		process.exit(1);
    	}
    	db.collection('sample').find().toArray(function(err, docs) {
    		if(err){
	    		console.log('err', err);
	    		process.exit(1);
	    	}
	    	for (doc in docs) {
	    		console.log(doc);
	    		process.exit(0);
	    	}
    	})
    })
});