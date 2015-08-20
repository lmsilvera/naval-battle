var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    utils = require('../../lib/utils');

  exports.load = function (req, res, next, id) {
    var options = {
      criteria: { _id : id }
    };
    User.load(options, function (err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    });
  };

  exports.create = function (req, res) {
    var user = new User(req.body);
    user.provider = 'local';
    user.save(function (err) {
      if (err) {
        return res.render('users/signup', {
          errors: utils.errors(err.errors),
          user: user,
          title: 'Sign up'
        });
      }

      // manually login the user once successfully signed up
      req.logIn(user, function(err) {
        if (err) req.flash('info', 'Sorry! We are not able to log you in!');
        return res.render('users/show', {
          title: user.name,
          user: user
        });
      });
    });
  };

  exports.show = function (req, res) {
    var user = req.profile;
    res.render('users/show', {
      title: user.name,
      user: user
    });
  };

  exports.signin = function (req, res) {};

  exports.authCallback = login;

  exports.login = function (req, res) {
    res.render('users/login', {
      title: 'Login'
    });
  };

  exports.signup = function (req, res) {
    res.render('users/signup', {
      title: 'Sign up',
      user: new User()
    });
  };

  exports.logout = function (req, res) {
    req.logout();
    res.redirect('/login');
  };

  exports.session = login;

  function login (req, res) {
    var redirectTo = req.session.returnTo ? req.session.returnTo : '/home';
    delete req.session.returnTo;
    res.redirect(redirectTo);
  };
