var express = require('express'),
    session = require('express-session'),
    morgan = require('morgan'),
    debug = require('debug'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    csrf = require('csurf'),
    mongoStore = require('connect-mongo')(session),
    flash = require('connect-flash'),
    helpers = require('view-helpers'),
    swig = require('swig'),
    config = require('config'),
    pkg = require('../package.json'),

    env = process.env.NODE_ENV || 'development';

module.exports = function (app, passport) {

  app.use(express.static(config.root + '/public'));

  if (env === 'development' || env === 'test') {
    swig.setDefaults({
      cache: false
    });
  }

  if (env !== 'test') app.use(morgan('dev'));

  app.engine('html', swig.renderFile);
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'html');

  app.use(function (req, res, next) {
    res.locals.pkg = pkg;
    res.locals.env = env;
    next();
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));

  app.use(cookieParser());
  app.use(cookieSession({ secret: '6h9591bbXW8gapg729oouiCQYE2oOg' }));
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: pkg.name,
    store: new mongoStore({
      url: config.db,
      collection : 'sessions'
    })
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());
  app.use(helpers(pkg.name));

  if (process.env.NODE_ENV !== 'test') {
    app.use(csrf());
    app.use(function (req, res, next) {
      res.locals.csrf_token = req.csrfToken();
      next();
    });
  }

}
