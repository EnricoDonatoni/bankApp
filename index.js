//express
var express = require('express');
var bodyParser = require('body-parser');

var modulo = require(__dirname+'/functions.js');
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
var i;
for(i=0; i<bankAccounts.length; i++){
	ccs.push(bankAccounts[i]);
} 

console.log(ccs);


/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());



app.get("/", function(req, res){

	res.sendfile(__dirname + "/pages/index.html");   
}); 

app.get("/ritorna", function(req, res){

	res.sendfile(__dirname + "/pages/index.html");   
}); 


app.post("/creacc", function(req, res){

	var nome = req.body.nom || req.query.nom;
	var password = req.body.psw || req.query.psw;

	console.log(nome);

    ccs.push(modulo.nuovocc(nome,password,ccs.length)); 
    console.log(ccs);
    res.sendfile(__dirname + "/pages/esitopositivo.html");
}); 

app.get("/deposito", function(req, res){

	var id = req.body.id || req.query.id;
	var dep = req.body.dep || req.query.dep;

	var indice = modulo.ricercacc(ccs,id);
	console.log(ccs[indice].saldo);
	if(parseInt(dep)> 500){
			console.log(ccs[indice].saldo + parseInt(dep));
			console.log("Errore");
			res.status(400).json({
					errore: "Errore"
				});
		}
	else{

		if(ccs[indice].saldo + parseInt(dep) > 5000){
			console.log(ccs[indice].saldo + parseInt(dep));
			console.log("Errore");
			res.status(400).json({
					errore: "Errore"
				});
		}
		else{
			ccs[indice].saldo += parseInt(dep);
			console.log(ccs[indice].saldo);
			res.sendfile(__dirname + "/pages/esitopositivo.html");
		}

	}

});

app.get("/prelievo", function(req, res){

	var id = req.body.id || req.query.id;
	var prel = req.body.prel || req.query.prel;

	var indice = modulo.ricercacc(ccs,id);
	console.log(ccs[indice].saldo);
	if(parseInt(prel)> 20){
			console.log(ccs[indice].saldo - parseInt(prel));
			console.log("Errore");
			res.status(400).json({
					errore: "Errore"
				});
		}
	else{

		if(ccs[indice].saldo - parseInt(prel) < 0){
			console.log(ccs[indice].saldo - parseInt(prel));
			console.log("Errore");
			res.status(400).json({
					errore: "Errore"
				});
		}
		else{
			ccs[indice].saldo -= parseInt(prel);
			console.log(ccs[indice].saldo);
			res.sendfile(__dirname + "/pages/esitopositivo.html");
		}

	}

});

app.get("/bonifico", function(req, res){

	var id = req.body.id || req.query.id;
	var idcred = req.body.idcred || req.query.idcred;
	var importo = req.body.importo || req.query.importo;

	var indice = modulo.ricercacc(ccs,id);
	var indicecred = modulo.ricercacc(ccs,idcred);

	if((ccs[indice].saldo - parseInt(importo))<0){
		console.log("Errore");
		res.status(400).json({
					errore: "Errore"
				});
	}
	else{
		if((ccs[indicecred].saldo + parseInt(importo))>5000){
			console.log("Errore");
			res.status(400).json({
					errore: "Errore"
				});
		}
		else{
			ccs[indice].saldo -= parseInt(importo);
			ccs[indicecred].saldo += parseInt(importo);
			res.sendfile(__dirname + "/pages/esitopositivo.html");
		}
	}

});

app.post("/bollettino", function(req, res){

	var iddeb = req.body.iddeb || req.query.iddeb;
	var idcred = req.body.idcred || req.query.idcred;
	var selection = req.body.selection || req.query.selection;
	var importo = req.body.importo || req.query.importo;


	var indicedeb = modulo.ricercacc(ccs,iddeb);

	if((selection == "MAV") && (importo == 16)){
		ccs[indicedeb].bollettini.push(JSON.stringify(modulo.nuovobollettino(iddeb,idcred,selection,importo,false)));
		res.sendfile(__dirname + "/pages/esitopositivo.html");
	}
	else{
		if((selection == "PGOOA") && (5<=importo)&&(importo<=17)){
			ccs[indicedeb].bollettini.push(JSON.stringify(modulo.nuovobollettino(iddeb,idcred,selection,importo,false)));
			res.sendfile(__dirname + "/pages/esitopositivo.html");
		}
		else
		{
			res.status(400).json({
					errore: "Errore"
				});
		}
	}

});

app.delete("/deletecc", function(req, res){

	var id = req.body.id || req.query.id;

	var indice = modulo.ricercacc(ccs,id);
	var nonpagato = false;
	console.log(ccs);

	console.log(id);
	if(ccs[indice].bollettini == []){
		ccs.splice(indice,1);
		res.sendfile(__dirname + "/pages/esitopositivo.html");
	}
	else{
		var i;
		for (i=0; i<ccs[indice].bollettini.length; i++){
			if(!ccs[indice].bollettini[i].pagato){
				nonpagato = true;
			}
		}

		if(nonpagato){
			res.status(400).json({
					errore: "Errore"
				});
		}
		else{
			ccs.splice(indice,1);
			res.sendfile(__dirname + "/pages/esitopositivo.html");
		}
	}



});


//listen in a specific port
app.listen((process.env.PORT || 65000));

//check status
console.log('Server running at http://localhost:65000/');