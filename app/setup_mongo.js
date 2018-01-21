//Conexão com o MongoDB
var mongo = require('mongoose');
var mongoaddr = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':27017/conpass_desafio';
console.log(mongoaddr);
mongo.connect(mongoaddr);