var mongo = require('mongoose');
var Schema = mongo.Schema;

var UserHistorySchema = new Schema({
	name: {type: String, required: true},
	email: {type: String, required: true},
	alias: {type: String, required: true},
	user: {type: mongo.Schema.Types.ObjectId, ref:'User', required: true, index: true},
	flows: [{
		flow: {type: mongo.Schema.Types.ObjectId, ref:'Flow', required: true, index: true},
		activities_started: [{occured: Date, "_id": false}],
		activities_ended: [{occured: Date, "_id": false}],
		activities_canceled: [{occured: Date, "_id": false}],
		step_activities_started: [{
			step: {type: mongo.Schema.Types.ObjectId, ref:'Step', required: true,},
			occured: Date,
			"_id": false
		}],
		step_activities_ended: [{
			step: {type: mongo.Schema.Types.ObjectId, ref:'Step', required: true},
			occured: Date,
			"_id": false
		}],
		step_activities_canceled: [{
			step: {type: mongo.Schema.Types.ObjectId, ref:'Step', required: true},
			occured: Date,
			"_id": false
		}],
		"_id": false
	}],
});

var UserHistory = mongo.model('UserHistories', UserHistorySchema);

module.exports = UserHistory;