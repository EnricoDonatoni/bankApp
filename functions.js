var uuid = require("uuid");
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