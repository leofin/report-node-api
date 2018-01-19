var mongo = require('mongoose');
var Schema = mongo.Schema;

var userSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  alias: {type: String, required: true},
});

var User = mongo.model('Users', userSchema);

module.exports = User;