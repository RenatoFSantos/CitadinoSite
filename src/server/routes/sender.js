var nodemailer = require('nodemailer');

var transportador = nodemailer.createTransport({

		// ---- CONTA DO GMAIL
	    service: 'gmail', //para contas gmail use "gmail"
	    auth: {
	        user: 'renato.insigne@gmail.com',
	        pass: 'maneIro9'
	    }

		// --- CONTA DA KINGHOST - não funcionou
		// host: 'smtp.kinghost.net',
		// port: 587,
	    // auth: {
	    //     user: 'contato@citadino.com.br',
	    //     pass: 'senhacon99'
	    // }


	});

exports.send = function(conteudo){

	transportador.sendMail(conteudo, function(error, info){
	    if(error){
	        console.log(error);
	    }else{
	        console.log('Email enviado ' + info.response);
	    }
	});
}