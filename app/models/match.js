var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MatchSchema = new Schema({
  player_one: {type : Schema.ObjectId, ref : 'User'},
  player_two: {type : Schema.ObjectId, ref : 'User'},
  winner: { type : Schema.ObjectId, ref : 'User' },
  time: { type: String, default: '' },
  date: { type: String, default: '' },
  createdAt: {type : Date, default : Date.now }
});

MatchSchema.statics = {

  load: function (id, cb) {
    this.findOne({ _id : id })
        .populate('user', 'name email username')
        .exec(cb);
  },

  list: function (options, cb) {
    var criteria = options.criteria || {}
    this.find(criteria)
        .populate('user', 'name username')
        .sort({ 'createAt': -1})
        .limit(options.perPage)
        .skip(options.perPage * options.page)
        .exec(cb);
  }

};

mongoose.model('Match', MatchSchema);
