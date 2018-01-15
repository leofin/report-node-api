//Exemplo de Web Service REST utilizando NodeJS e MongoDB em Containers Docker
// Matheus Fidelis - github.com/msfidelis

var express = require('express');
var mongo = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Conexão com o MongoDB
var mongoaddr = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':27017/testeapi';
console.log(mongoaddr);
mongo.connect(mongoaddr);

//Esquema da collection do Mongo
var taskListSchema = mongo.Schema({
	descricao : { type: String },
	concluido : Boolean,
	updated_at: { type: Date, default: Date.now },
});

//Model da aplicação
var Model = mongo.model('Tasks', taskListSchema);

//GET param - Retorna o registro correspondente da ID informada
app.get("/get/:descricao?", function (req, res) {
	var descricao = req.params.descricao;
	Model.find({'descricao': descricao}, function(err, regs) {
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
	Model.find(function(err, todos) {
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