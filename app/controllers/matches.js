var mongoose = require('mongoose'),
    Match = mongoose.model('Match'),
    utils = require('../../lib/utils');

exports.load = function (req, res, next, id){
  var User = mongoose.model('User');

  Match.load(id, function (err, match) {
    if (err) return next(err);
    if (!match) return next(new Error('not found'));
    req.match = match;
    next();
  });
};

exports.index = function (req, res) {
  var page = (req.params.age > 0 ? req.params.page : 1) -1;
  var perPage = 30;
  var options = {
    perPage: perPage,
    page: page
  };

  Match.list(options, function (err, matches) {
    if (err) return res.render('500');
    Match.count().exec(function (err, count) {
      res.render('matches/index', {
        title: 'Matches',
        matches: matches,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};

exports.new = function (req, res) {
  res.render('matches/new', {
    title: 'New Match',
    match: new Match({})
  });
};

exports.create = function (req, res) {
  var match = new Match(req.body);
  match.player_one = req.player_one;
  match.player_two = req.player_two;
  match.winner = req.winner;

  user.save(function (err) {
    if (!err) {
      req.flash('success', 'Successfully created match!');
      return res.redirect('/matches/'+match._id);
    }
    res.render('matches/new', {
      title: 'New Match',
      match: match,
      errors: utils.errors(err.errors || err)
    });
  });
};

exports.edit = function (req, res) {
  res.render('matches/edit', {
    title: 'Edit' + req.match._id,
    match: req.match
  });
};

exports.update = function (req, res) {
};

exports.show = function (req, res) {
  res.render('matches/show', {
    title: req.match._id,
    match: req.match
  });
};

exports.destroy = function (req, res) {
  var match = req.match;
  match.remove(function(err){
    req.flash('info', 'Deleted Successfully');
    res.redirect('/matches');
  });
};
