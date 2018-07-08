var uuid = require("uuid");
var fetch = require("node-fetch");
//per creare un nuovo cc.
exports.nuovocc = function(nome,password,id){

	var nuovocc = {
		"id": id,
		"nomeUtente": nome,
		"password": password,
		"saldo": 0,
		"bollettini": []
	};

	return nuovocc;

};

//per creare un nuovo bollettino
exports.nuovobollettino = function(iddeb,idcred,tipo,imp,pagato){

	var nuovoBoll = {
		"id": uuid.v4(),
		"iddebitore": iddeb,
		"idcreditore": idcred,
		"tipo": tipo,
		"importo": imp,
		"pagato": pagato
	};

	return nuovoBoll;

};

//ritorna l'indice del cc.
exports.ricercacc = function(ccs,ids){

	var i;
	for(i=0;i<ccs.length;i++){
		if(ccs[i].id == ids){
			return i;
		}
	}
};

exports.cambioCI = function(saldo,certo,incerto){

	var panoramicaSaldo = {
		saldocerto: saldo,
		saldoincerto: null
	};

	var url = "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency="+certo+"&to_currency="+incerto+"&apikey=B3GGEIAGNOCSWB93";
	//var url = "https://www.alphavantage.co/query";
	//fetch(url,{method : 'POST', body: 'a=1'})
	/*fetch(url)
	.then(async function(res) {
		rez = await (res.json())
		rez = res.json();
		console.log(rez);
	})*/

	return fetch(url)
		.then(res => {
			return res.json();
			
		})
		.then(exchange => {
			var key = Object.keys(exchange)[0];

			var rate = exchange[key.toString()][Object.keys(exchange[key.toString()])[4]];
			//console.log(exchange);
			panoramicaSaldo.saldoincerto = saldo*rate;
			return panoramicaSaldo;
		});

	//return panoramicaSaldo;
	


};
