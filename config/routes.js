var home = require('home'),
    users = require('users'),
    auth = require('./middlewares/authorization');

module.exports = function (app, passport) {

  app.get('/', users.login);
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.get('/home', home.index);

  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      successFlash: 'Login successfully',
      failureFlash: 'Invalid email or password.'
    }), users.session);

  app.get('/users/:userId', users.show);

  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: ['email', 'user_about_me'],
      failureRedirect: '/login'
    }), users.signin);

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }), users.authCallback);

  app.param('userId', users.load);

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });

}
