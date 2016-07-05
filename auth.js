var wagner = require('wagner-core');

function setupAuth(User, app) {
  var passport = require('passport');
  var FacebookStrategy = require('passport-facebook').Strategy;

  // serialize user instance to the session
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  //de-serialize user from the session
  passport.deserializeUser(function(id, done) {
    User.
      findOne({ _id : id }).
      exec(done);
  });

  // Facebook-specific
  var fb_auth = wagner.invoke(function(Config) {
        return Config;
      })
  passport.use(new FacebookStrategy(
    {
      // use the Config service instead of process.env.FACEBOOK_CLIENT_SECRET
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

      User.findOneAndUpdate(
        { 'data.oauth': profile.id },
        {
          $set: {
            'profile.username': profile.emails[0].value,
            'profile.picture': 'http://graph.facebook.com/' +
              profile.id.toString() + '/picture?type=large'
          }
        },
        { 'new': true, upsert: true, runValidators: true },
        function(error, user) {
          done(error, user);
        });
    }));

  // Express middlewares
  app.use(require('express-session')({
    secret: 'this is a secret'
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
