var mongo = require('mongoose');
var Schema = mongo.Schema;

var stepSchema = new Schema({
  title: {type: String, required: true},
  flow: {ref:'flow', required: true}
});

var Step = mongo.model('Steps', stepSchema);

Step.achar = function(args, callback) {
  Step.find({_id: "5a5663eedff37114608e333b"}, function(err, regs) {
    callback(err,regs);
  });
}

module.exports = Step;