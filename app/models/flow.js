var mongo = require('mongoose');
var Schema = mongo.Schema;

var flowSchema = new Schema({
  title: {type: String, required: true},
});

var Flow = mongo.model('Flows', flowSchema);

Flow.achar = function(args, callback) {
  Flow.find({_id: "5a5663eedff37114608e333b"}, function(err, regs) {
    callback(err,regs);
  });
}

module.exports = Flow;