
var sender = require('./sender');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Api acessada.');
});

router.post('/enviaremail', (req, res) => {
  let configuracoes = {};
  if(req.body.cont_tx_mensagem=='Quero divulgar meus dados na Lista Telefônica') {
    configuracoes = {
        from: `Contato <contato@citadino.com.br>`,
        to: `Renato <renato@citadino.com.br>`,
        subject: 'Cadastro Citadino',
        text: `Olá ${req.body.cont_tx_nome}!<br/>
        Agradecemos seu cadastro e gostaríamos apenas que confirmasse suas informações e seu interesse em divulgá-las em nosso app.<br/>
        Para isto responda a este email autorizando a publicação.<br/>
        Grato!`,
        html: `
          <h3>${req.body.cont_tx_mensagem}</h3><br/>
          <hr/>
          Nome: ${req.body.cont_nm_nome}<br/>
          email: ${req.body.cont_ds_email}<br/>
          Telefone: ${req.body.cont_ds_telefone}<br/>
          Endereço: ${req.body.cont_tx_endereco}<br/>
          Bairro: ${req.body.cont_tx_bairro}<br/>
          Cidade/UF: ${req.body.cont_tx_cidade}/${req.body.cont_sg_uf}<br/>
          CEP: ${req.body.cont_nr_cep}<br/>
          <hr/>
        `
    };
  } else {
    configuracoes = {
        from: `Contato <contato@citadino.com.br>`,
        to: 'Citadino <renato@citadino.com.br>',
        subject: 'Contato Citadino',
        text: `${req.body.cont_tx_mensagem} - email: ${req.body.cont_ds_email}`,
        html: `
          <h3>${req.body.cont_tx_mensagem}</h3><br/>
          <hr/>
          Nome: ${req.body.cont_nm_nome}<br/>
          email: ${req.body.cont_ds_email}<br/>
          telefone: ${req.body.cont_ds_telefone}<br/>
          <hr/>
        `
    };
  }
	sender.send(configuracoes);
  res.send('Concluido');
});

module.exports = router;