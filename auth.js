var wagner = require('wagner-core');
var session = require('express-session');

function setupAuth(Student, app) {
  var passport = require('passport');
  var FacebookStrategy = require('passport-facebook').Strategy;
  //Passport will maintain persistent login sessions. In order
  //for persistent sessions to work, the authenticated user
  //must be serialized to the session, and deserialized
  //when subsequent requests are made.
  // serialize student instance to the session
  passport.serializeUser(function(student, done) {
    done(null, student._id);
  });
  //de-serialize student from the session
  passport.deserializeUser(function(id, done) {
    Student.
      findOne({ _id : id }).
      exec(done);
  });

  // Facebook-specific
  var fb_auth = wagner.invoke(function(Config) {
        return Config;
      });
  passport.use(new FacebookStrategy(
    {
      // use the Config service, in lieu of process.env
      clientID: fb_auth.facebookClientId,
      clientSecret: fb_auth.facebookClientSecret,
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      // Necessary for new version of Facebook graph API
      profileFields: ['id', 'emails', 'name']
    },
    function(accessToken, refreshToken, profile, done) {
      if (!profile.emails || !profile.emails.length) {
        return done('No emails associated with this account!');
      }

      Student.findOneAndUpdate(
        { 'data.oauth': profile.id },
        {
          $set: {
            'profile.username': profile.emails[0].value,
            'profile.picture': 'http://graph.facebook.com/' +
              profile.id.toString() + '/picture?type=large'
          }
        },
        { 'new': true, upsert: true, runValidators: true },
        function(error, student) {
          done(error, student);
        });
    }));

  // Express middlewares
  app.use(session({
    secret: 'this is a secret',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Express routes for auth
  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/fail' }),
    function(req, res) {
      res.send('Welcome, ' + req.user.profile.username);
    });
}

module.exports = setupAuth;
