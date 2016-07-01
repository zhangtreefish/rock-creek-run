var _ = require('underscore');
_.each([1,2,3], function(v){
	console.log(v);
});

// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
//MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
MongoClient.connect("mongodb://lz:S4M3K4@ds035348.mlab.com:35348/projects", function(err, db) {
  	if(err) {
     	console.log("error at connect", err);
     	process.exit(1);
	}
	var piece1 = {
		title: 'The Gondola',
		composer: 'Faber',
		genre: 'Contemporary',
		arranger: '',
		book: 'Lesson Book Level 4, Fabers',
		pages: [14,15],
		};
	var piece2 = {
		title: 'Menuet',
		composer: 'J.S. Bach(1685-1750)',
		genre: 'Baroque',
		arranger: '',
		book: "J.S. Bach, Selections from Anna Magalena's Notebook, Edited by Willard A. Palmer",
		pages: [26,27],
		};
	var piece3 = {
		title: 'Sonatina, Op. 36, No. 1',
		composer: 'Muzio Clementi(1752-1832)',
		genre: 'Classical',
		arranger: '',
		book: 'Artist Piano Sonatinas, Book Two Intermediate, Compiled and edited by Nancy and Randall Faber',
		pages: [34,40],
		};
	var piece4 = {
		title: 'Ballad',
		composer: 'Johann Burgmuller(1806-1874)',
		genre: 'Classical',
		arranger: 'None',
		book: 'Lesson Book Level 5, Fabers',
		pages: [53,55],
		};
	var piece5 = {
		title: 'Duel of the Fates',
		composer: 'John Williams',
		genre: 'Contemporary',
		arranger: '',
		book: 'Star Wars, Music by John Williams',
		pages: [12, 15],
		};
	db.collection('repertoire').remove();
	//db.collection('repertoire').createIndex({"title": 1}, { "unique": true });
    db.collection('repertoire').insertMany([piece1, piece2, piece3, piece4, piece5], function(err, result) {
    	if(err){
    		console.log('err at insert', err);
    		process.exit(1);
    	}
    	var query = { genre: 'Classical'};
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