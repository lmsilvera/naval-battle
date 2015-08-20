var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('User'),

    //Providers
    local = require('./passport/local'),
    facebook = require('./passport/facebook');


module.exports = function (passport, config) {

  passport.serializeUser(function(user, done){
    done(null, user.id);
  })

  passport.deserializeUser(function(id, done){
    User.load({ criteria: { _id: id } }, function(err, user){
      done(err, user)
    })
  })

  passport.use(local);
  passport.use(facebook);

};
