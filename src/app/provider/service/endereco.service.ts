import { EnderecoTO } from './../../model/enderecoTO';
import { EnderecoVO } from './../../model/enderecoVO';
import { FirebaseService } from './../database/firebase.service';
import { Injectable, Component } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class EnderecoService {

  constructor(private fbSrv: FirebaseService) {
  }

  getEnderecosUsuario(id: string) {
    return firebase.database().ref('/usuario/' + id).child('endereco').once('value').then((enderecos) => {
       return enderecos;
    },
    err => {
       throw 'Não existem endereços cadastrados.';
    });
  }

  getEnderecoUsuario(idUsua: string, idEnde: string) {
    // return firebase.database().ref(`/endereco/${idEnde}/`).child(`usuario/${idUsua}`).equalTo(idUsua).once('value').then((endereco) => {
    return firebase.database().ref(`/endereco/${idEnde}`).once('value').then((endereco) => {
       return endereco;
    },
    err => {
       throw 'Endereços não encontrados.';
    });    
  }

  removendoEndereco(idUsua: string, idEnde: string) {
    let result;
    let update = {};
    update[`/endereco/${idEnde}`] = null;
    update[`/usuario/${idUsua}/endereco/${idEnde}`] = null;
    result =  firebase.database().ref().update(update);
    return result;     
  }

  atualizarEndereco(endereco: EnderecoVO, tipo: string) {
      let result;
      let refReg: string = '';
      if(tipo==='I') {
        console.log('Modo de Inclusão de endereço');
        refReg = firebase.database().ref().child('endereco').push().key;
        endereco.ende_sq_id = refReg;
      } else {
        console.log('Modo de Alteração de endereço');
        refReg = endereco.ende_sq_id;
      }
      let modelJSON = this.criaEstruturaJSON(endereco);
      let enderecoTO: EnderecoTO = new EnderecoTO();
      enderecoTO.ende_sq_id = refReg;
      enderecoTO.ende_cd_endereco = endereco.ende_cd_endereco;
      //let modelJSON;
      console.log('Modelo JSON de endereço ', modelJSON);
      let update = {};
     
      update[`/endereco/${refReg}`] = modelJSON;
      update[`/usuario/${endereco.usuario.usua_sq_id}/endereco/${refReg}`] = enderecoTO;
      result =  firebase.database().ref().update(update);
      return result;  
  }

  criaEstruturaJSON(model) {
    let json: string;  
    json = 
    '{' +
      '"ende_sq_id":"' + model.ende_sq_id + '",' +
      '"ende_cd_endereco":"' + model.ende_cd_endereco + '",' +
      '"ende_tx_endereco":"' + model.ende_tx_endereco + '",' +
      '"ende_tx_bairro":"' + model.ende_tx_bairro + '",' +
      '"ende_tx_cidade":"' + model.ende_tx_cidade + '",' +
      '"ende_sg_uf":"' + model.ende_sg_uf + '",' +
      '"ende_nr_cep":"' + model.ende_nr_cep + '",' +
      '"usuario": {"' + model.usuario.usua_sq_id + '": ' +
        '{' + 
        '"usua_sq_id":"' + model.usuario.usua_sq_id + '",' +
        '"usua_nm_usuario":"' + model.usuario.usua_nm_usuario + '"' +
        '}}' +
    '}'
    let convertJSON = JSON.parse(json);
    return convertJSON;
  }  

  carregaObjeto(objEndereco):EnderecoVO {
    let objRetorno: EnderecoVO = new EnderecoVO();
    let objValor: any;
    let obj: any;
    if(objEndereco.ende_sq_id!=undefined) {
      objValor = objEndereco;
      obj = JSON.parse(JSON.stringify(objEndereco));
    } else {
      console.log('Objeto Tabela de Preco com VAL()');
      objValor = objEndereco.val();
      obj = JSON.parse(JSON.stringify(objEndereco.val()));
    }

    let indUsuario = Object.keys(obj.usuario);

    objRetorno.ende_sq_id = objEndereco.key;
    objRetorno.ende_cd_endereco = objValor.ende_cd_endereco;
    objRetorno.ende_tx_endereco = objValor.ende_tx_endereco;
    objRetorno.ende_tx_bairro = objValor.ende_tx_bairro;
    objRetorno.ende_tx_cidade = objValor.ende_tx_cidade;
    objRetorno.ende_sg_uf = objValor.ende_sg_uf;
    objRetorno.ende_nr_cep = objValor.ende_nr_cep;
    objRetorno.usuario.usua_sq_id = objValor.usuario[indUsuario[0]].usua_sq_id;
    objRetorno.usuario.usua_nm_usuario = objValor.usuario[indUsuario[0]].usua_nm_usuario;

    return objRetorno;
  }  
}