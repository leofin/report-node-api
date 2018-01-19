var mongo = require('mongoose');
var Schema = mongo.Schema;

var reportUserSchema = new Schema({

});

var ReportUser = mongo.model('ReportUsers', reportUserSchema);

module.exports = ReportUser;