var mongo = require('mongoose');
var Schema = mongo.Schema;

var FlowStatisticsSchema = new Schema({
    flow: {type: mongo.Schema.Types.ObjectId, ref:'Flow', required: true, index: true},
	title: {type: String, required: true},
    user_histories: [{type: mongo.Schema.Types.ObjectId, ref: 'UserHistory'}],
	count_activities_started: {type: Number, default: 0},
	count_activities_ended: {type: Number, default: 0},
	count_activities_canceled: {type: Number, default: 0},
	steps: [{
		title: {type: String, required: true},
	 	step: {type: mongo.Schema.Types.ObjectId, ref:'Step', required: true, index: true, unique : true},
		count_activities_started: {type: Number, default: 0},
		count_activities_ended: {type: Number, default: 0},
		count_activities_canceled: {type: Number, default: 0},
	 }],
});

var FlowStatistics = mongo.model('FlowsStatistics', FlowStatisticsSchema);

module.exports = FlowStatistics;