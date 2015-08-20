var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AttackSchema = new Schema({
  user_id: { type: Number },
  game_id: { type: Number },
  position: { type: String, default: '' }
});

mongoose.model('Attack', AttackSchema);
