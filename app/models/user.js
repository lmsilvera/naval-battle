var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema,
    oAuthTypes = ['facebook'];

var UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  username: { type: String, default: '' },
  provider: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  authToken: { type: String, default: '' },
  facebook: {}
});

  UserSchema
    .virtual('password')
    .set(function(password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
    })
    .get(function() { return this._password });

  UserSchema.methods = {

    authenticate: function (plainText) {
      return this.encryptPassword(plainText) === this.hashed_password;
    },

    makeSalt: function () {
      return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    encryptPassword: function (password) {
      if (!password) return '';
      try {
        return crypto
          .createHmac('sha1', this.salt)
          .update(password)
          .digest('hex');
      } catch (err) {
        return '';
      }
    },

    skipValidation: function() {
      return ~oAuthTypes.indexOf(this.provider);
    }

  };

  UserSchema.statics = {
    load: function (options, cb) {
      options.select = options.select || 'name username';
      this.findOne(options.criteria)
        .select(options.select)
        .exec(cb);
    }
  }

  mongoose.model('User', UserSchema);
