//express
var express = require('express');
var bodyParser = require('body-parser');
//inspect variables
var fs = require('fs');
var util = require('util');
//var modulo = require("./funzioni.js");

//instantiate express
var app = express();

var maxdeposito = 500;
var maxprelievo = 20;
var maxcc = 5000;


app.use(bodyParser.urlencoded({
    extended: true
}));

var bankAccounts = JSON.parse(fs.readFileSync('bankAccounts.json','utf8')); 
var ccs = [];
console.log(bankAccounts[0].nomeUtente);


/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());



app.get("/", function(req, res){

	res.sendfile(__dirname + "/pages/index.html");   
}); 

app.post("/creacc", function(req, res){

	//var id = req.body.id || req.query.id;
    //var ris = req.body.ris || req.query.ris;

    ccs.push(creajsoncc()); 
}); 

app.post
//listen in a specific port
app.listen((process.env.PORT || 65000));

//check status
console.log('Server running at http://localhost:65000/');