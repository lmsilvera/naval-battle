var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MatchSchema = new Schema({
  player_one_id: { type: Number },
  palyer_two_id: { type: Number },
  time: { type: String, default: '' },
  date: { type: String, default: '' },
  winner_id: { type: Number, min: 0 }
});

mongoose.model('Match', MatchSchema);
