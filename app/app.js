var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

require("./setup_mongo.js")

//Models
User = require("./models/user.js")
Step = require("./models/step.js")
Flow = require("./models/flow.js")
Activity = require("./models/activity.js")
FlowStatistics = require("./models/flow_statistics.js")
UserHistory = require("./models/user_history.js")

//GET param - Retorna relatorio de estatisticas de fluxos paginado, possibilidade de filtro pelo ID do fluxo
app.get("/flow_statistics/:id?", function (req, res) {
  let page = req.query.page || 1;
  let size = req.query.size || 10;
  let query = req.params.id ? {flow: req.params.id} : {};
  let offset = size*(page-1);

  console.log(offset);

  FlowStatistics.find(query).limit(size).skip(offset).exec(function(err, regs){
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(regs);
    }
  });
});

//GET param - Retorna relatorio de historico do usuario paginado, possibilidade de filtro pelo ID do user
app.get("/user_history/:id?", function (req, res) {
  let page = req.query.page || 1;
  let size = req.query.size || 10;
  let query = req.params.id ? {user: req.params.id} : {};
  let offset = size*(page-1);

  console.log(offset);

  UserHistory.find(query).limit(size).skip(offset).exec(function(err, regs){
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(regs);
    }
  });
});

//Porta de escuta do servidor
app.listen(3000, function() {
  console.log('Funcionando');
});