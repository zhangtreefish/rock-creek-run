//Inserts "doc" into the collection "repertoire".
exports.insert = function(db, doc, callback) {
    db.collection('repertoire').insert(doc, function(error) {
        if(error){
            assert.ifError(error);
            process.exit(1);
        };
        callback(null);
        process.exit(0);
    });
};

// Finds all documents in the "repertoire" collection
// whose "genre" field equals the given period,
// ordered by the peice's "composer.year" field. See
// http://mongodb.github.io/node-mongodb-native/2.0/api/Cursor.html#sort
exports.byGenre = function(db, director, callback) {
    db.collection('repertoire').find({"genre": Classical}).sort({"composer.years": 1}).toArray(function(error, movies) {
        if(error){
            process.exit(1);
        };
        callback(null);
        process.exit(0);
    });
};