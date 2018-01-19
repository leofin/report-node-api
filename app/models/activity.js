var mongo = require('mongoose');
var Schema = mongo.Schema;

var activitySchema = new Schema({
  flow: {ref:'flow', required: true},
  step: {ref:'step', required: true},
  user: {ref:'user', required: true},
  status: String,
  occured: Date,
  type: String
});

var Activity = mongo.model('Activities', activitySchema);

module.exports = Activity;