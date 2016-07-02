var assert = require('assert');
var connect = require('./connect');
var rockCreekRunInterface = require('./interface');
var fs = require('fs');
var repertoire = require('./pieces.json');  //normally would be named 'pieces'

//This test suite is meant to be run through gulp (use the `npm run watch`)
//script.

describe('rockCreekRunInterface', function() {
    var db;
    var succeeded = 0;
    var classicalPieces;

    it('can insert a piece', function(done) {
        var doc = {
            title: 'Kawasaki Disease',
            composer: {
                name: 'Treefish',
                years: ''
            },
            genre: 'Nerdy',
            arranger: '',
            book: '',
            pages: [],
        };
        rockCreekRunInterface.insert(db, doc, function(error) {
            assert.ifError(error);
            db.collection('repertoire').count({ title: 'Kawasaki Disease' }, function(error, c) {
                assert.ifError(error);
                assert.equal(c, 1);
                done();
            });
        });
    });

    //This test ensures that interface.js' `byGenre()` function can load document(s).
    it('can query data by Genre', function(done) {
        rockCreekRunInterface.byGenre(db, 'Nerdy', function(error, docs) {
            assert.ifError(error);
            assert.ok(Array.isArray(docs));
            assert.equal(docs.length, 1);
            assert.equal(docs[0].title, 'Kawasaki Disease');
            ++succeeded;
            done();
        });
    });

    //This test ensures that interface.js' `byGenre()` function loads
    //pieces in ascending order by their composer's years, at least
    //in lexicographic order.
    it('returns multiple results ordered by title', function(done) {
        rockCreekRunInterface.byGenre(db, 'Classical', function(error, docs) {
            assert.ifError(error);
            assert.ok(Array.isArray(docs));
            assert.equal(docs.length, 2);
            assert.equal(docs[0].title, 'Sonatina, Op. 36, No. 1');
            assert.equal(docs[1].title, 'Ballad');

            docs.forEach(function(doc) {
                delete doc._id;
            });
            assert.deepEqual(Object.keys(docs[0]), ['title', 'composer', 'genre', 'arranger', 'book', 'pages']);
            ++succeeded;
            classicalPieces = docs;
            done();
        });
    });

    //This function does some basic setup work to make sure you have the correct
    // data in your "repertoire" collection.
    before(function(done) {
        connect(function(error, conn) {
            if (error) {
                return done(error);
            }
            db = conn;
            db.collection('repertoire').remove({}, function(error) {
                if (error) {
                    return done(error);
                }

                var fns = [];
                repertoire.pieces.forEach(function(piece) {
                    fns.push(function(callback) {
                        rockCreekRunInterface.insert(db, piece, callback);
                    });
                });
                require('async').parallel(fns, done);
            });
        });
    });

  /**
   *  The below code generates the answer code that we will use to
   *  verify you got the correct answer. Modifying this code is a
   *  violation of the honor code.
   */
    after(function(done) {
        if (succeeded >= 2) {
            var _0xc3a0=["\x74\x65\x73\x74","\x6C\x65\x6E\x67\x74\x68","\x2E\x2F\x6F\x75\x74\x70\x75\x74\x2E\x64\x61\x74","\x74\x68\x65\x20\x6D\x65\x61\x6E\x20\x73\x74\x61\x63\x6B\x20\x61\x77\x61\x6B\x65\x6E\x73","\x77\x72\x69\x74\x65\x46\x69\x6C\x65\x53\x79\x6E\x63","\x66\x73"];var x={};x[_0xc3a0[0]]=classicalPieces[_0xc3a0[1]];require(_0xc3a0[5])[_0xc3a0[4]](_0xc3a0[2],x[_0xc3a0[0]]===4&&_0xc3a0[3]);
            db.close(done);
        } else {
            db.close(done);
        }
    });
});
