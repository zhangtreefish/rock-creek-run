var _ = require('underscore');
var pieces = require('./pieces.json');

// Retrieve
var MongoClient = require('mongodb').MongoClient;
//var piece_array = JSON.parse(pieces).pieces;SyntaxError: Unexpected token o in JSON at position 1
//console.log(piece_array[0].title);
var piece_array = [];
for(var i in pieces.pieces) {
    if(pieces.pieces.hasOwnProperty(i) && !isNaN(+i)) {
        piece_array[+i] = pieces.pieces[i];
    }
}
// var models = require('./models')(wagner);
// var Piece = models.Piece;
// Connect to the db
//MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
MongoClient.connect("mongodb://lz:S4M3K4@ds035348.mlab.com:35348/projects", function(err, db) {
  	if(err) {
     	console.log("error at connect", err);
     	process.exit(1);
	}

	//db.collection('repertoire').remove();
	//db.collection('repertoire').createIndex({"title": 1}, { "unique": true });
    db.collection('repertoire').insertMany(piece_array, function(err, result) {
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