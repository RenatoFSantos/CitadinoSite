import { ContatoVO } from './../../model/contatoVO';
import { CtdFuncoes } from './../../../ctd-funcoes';
import { Observable } from 'rxjs/Observable';
import { FirebaseService } from './../database/firebase.service';
import { Injectable, Component } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class ContatoService {

  metadata = {
    contentType: 'image/jpeg'
  };  

  constructor(private fbSrv: FirebaseService) {
  }

  atualizarCadastro(contato: ContatoVO) {
      let result;
      let refCon;
      let update = {};
      let modelJSON;

      console.log('Qual o valor da mensagem=', contato.cont_tx_mensagem);

      if(contato.cont_tx_mensagem==null || contato.cont_tx_mensagem=='' || contato.cont_tx_mensagem=='undefined' || contato.cont_tx_mensagem==undefined) {
        contato.cont_tx_mensagem = 'Quero divulgar meus dados na Lista Telefônica';
      } else {
        console.log('Não identifiquei o conteúdo da mensagem');
      }

      refCon = firebase.database().ref().child('contato').push().key;
      contato.cont_sq_id = refCon;

      // Criando o modelo JSON da empresa
      modelJSON = this.criaEstruturaJSON(contato);
      update[`/contato/${refCon}`] = modelJSON;
      
      console.log('Executando a atualização');
      result =  firebase.database().ref().update(update);
      return result;

  }

  criaEstruturaJSON(model) {
    let json: string;
    json = 
    '{' +
      '"cont_sq_id":"' + model.cont_sq_id + '",' +
      '"cont_nm_nome":"' + model.cont_nm_nome + '",' +
      '"cont_tx_endereco":"' + model.cont_tx_endereco + '",' +
      '"cont_tx_bairro":"' + model.cont_tx_bairro + '",' +
      '"cont_tx_cidade":"' + model.cont_tx_cidade + '",' +
      '"cont_sg_uf":"' + model.cont_sg_uf + '",' +
      '"cont_nr_cep":"' + model.cont_nr_cep + '",' +
      '"cont_ds_telefone":"' + model.cont_ds_telefone + '",' +
      '"cont_ds_email":"' + model.cont_ds_email + '",' +
      '"cont_tx_mensagem":"' + model.cont_tx_mensagem + '",' +
      '"cont_in_autorizacao":' + model.cont_in_autorizacao + 
    '}';

    console.log('JSON criado da empresa=', json);

    let convertJSON = JSON.parse(json);
    return convertJSON;
  }
  
}