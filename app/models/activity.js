var mongo = require('mongoose');
var Schema = mongo.Schema;

var activitySchema = new Schema({
  flow: {type: mongo.Schema.Types.ObjectId, ref:'Flow', required: true},
  step: {type: mongo.Schema.Types.ObjectId, ref:'Step', required: true},
  user: {type: mongo.Schema.Types.ObjectId, ref:'User', required: true},
  status: {type: String, enum: ['start', 'end', 'cancel']},
  occured: Date,
  type: {type: String, enum: ['flow', 'step']}
});

var Activity = mongo.model('Activities', activitySchema);

module.exports = Activity;