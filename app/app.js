var express = require('express');
var mongo = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Conexão com o MongoDB
var mongoaddr = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':27017/conpass_desafio';
console.log(mongoaddr);
mongo.connect(mongoaddr);

//Model user
User = require("./models/user.js")

//GET param - Retorna o user correspondente da ID informada
app.get("/user/:id?", function (req, res) {
  var id = req.params.id;
  User.findById(id, function(err, regs){
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(regs);
    }
  });
});

//GET param - Retorna o user correspondente da ID informada
app.get("/user2/:id?", function (req, res) {
  var id = req.params.id;
  User.find(id, function(err, regs){
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(regs);
    }
  });
});

//POST - Adiciona um registro
app.post("/api/add", function (req, res) {
  var register = new Model({
    'descricao' : req.body.descricao,
    'concluido' : req.body.concluido
  });
  register.save(function (err) {
    if (err) {
      console.log(err);
      res.send(err);
      res.end();
    }
  });
  res.send(register);
  res.end();
});

//GET - Retorna todos os registros existentes no banco
app.get("/api/all", function (req, res) {
  User.find(function(err, todos) {
    if (err) {
      res.json(err);
    } else {
      res.json(todos);
    }
  })
});

//PUT - Atualiza um registro
app.put("/api/add/:id", function (req, res) {
  Model.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err)  {
      return next(err);
    } else {
      res.json(post);
    }
  });
});

//DELETE - Deleta um registro
app.delete("/api/delete/:id", function (req, res) {
 Model.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

//Porta de escuta do servidor
app.listen(8080, function() {
  console.log('Funcionando');
});