import { EmpresaVO } from './../../model/empresaVO';
import { CtdFuncoes } from './../../../ctd-funcoes';
import { AgendaVO } from './../../model/agendaVO';
import { Observable } from 'rxjs/Observable';
import { SmartsiteVO } from './../../model/smartsiteVO';
import { FirebaseService } from './../database/firebase.service';
import { Injectable, Component } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class SmartsiteService {

  smartsite: SmartsiteVO;

  metadata = {
    contentType: 'image/jpeg'
  };  

  constructor(private fbSrv: FirebaseService) {
  }

  getSmartsites() {
    return firebase.database().ref('/smartsite').once('value').then((smartsites) => {
       return smartsites;
    },
    err => {
       throw 'Não existem smartsites cadastrados.';
    });
  }

  getSmartsite(id: string) {
    return firebase.database().ref(`/smartsite/${id}`).once('value').then((smartsite) => {
       console.log('Código do Smartsite do crud=', id);
       return smartsite;
    },
    err => {
       throw 'Smartsites não encontradas.';
    });    

  }
  
  removerSmartsite(smartsite: SmartsiteVO) {
    console.log('Entrei na rotina de exclusão do smartsite');
    let update = {};

    // Removendo o smartsite relacionado

    update[`/smartsite/${smartsite.smar_sq_id}`] = null;
    update[`/empresa/${smartsite.empresa.empr_sq_id}/smartsite/${smartsite.smar_sq_id}`] = null;

    return firebase.database().ref().update(update);

  }
  
  atualizarSmartsite(smartsite: SmartsiteVO, empresa: EmpresaVO, tipo: string) {
      let objRef;
      let result;
      let refSmar;
      let refDesc;
      let update = {};
      let modelJSON = '';
      this.smartsite = new SmartsiteVO();

      if(tipo=='I') {
        console.log('Entrei na inclusão do smartsite');
        refSmar = firebase.database().ref().child('smartsite').push().key;
        smartsite.smar_sq_id = refSmar;
      } else {
        console.log('Entrei na alteração do smartsite');
        refSmar = smartsite.smar_sq_id;
     
      }

      smartsite.empresa = empresa;
      
      // Criando o modelo JSON da smartsite
      modelJSON = this.criaEstruturaJSON(smartsite);
      console.log('modelJSON=', modelJSON);
      
      console.log('Codigo da empresa de referencia=', empresa.empr_sq_id);

      // Atualizando dados da Smartsite
      update[`/smartsite/${refSmar}`] = modelJSON;
      update[`/empresa/${empresa.empr_sq_id}/smartsite/${refSmar}`] = true;

      result =  firebase.database().ref().update(update);
      return result;
  }

  atualizarNomeArquivo(idSmartsite, txArquivo) {
      let update = {};
      let modelJSON = 
      firebase.database().ref().child(`smartsite/${idSmartsite}`).update(
        {
          smar_tx_imagem1: txArquivo
        }
      )
  }
  
  uploadImagemSmartsite(file, idSmartsite):Promise<string> {
      let result: string = '';
      let metadata = {
          contentType: 'image/png',
          name: '',
          cacheControl: 'no-cache',
      };  
      return new Promise((resolve) => {
        let progress: number = 0;
        let storageRef = firebase.storage().ref();
        let imageRef = storageRef.child(`images/smartsite/${idSmartsite}/${file.name}`);
        let uploadTask = storageRef.child(`images/smartsite/${idSmartsite}/${file.name}`).put(file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function(snapshot) {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }          
          }, function(error) {
            switch (error.name) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;

              case 'storage/canceled':
                // User canceled the upload
                break;

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;

            }
        }, function() {
          // Upload completed successfully, now we can get the download URL
          let downloadURL = uploadTask.snapshot.downloadURL;
          console.log('retornando o nome do arquivo após upload');
          result =  downloadURL;
          resolve(result);
        });
      })

  }

  carregaObjeto(objSmartsite):SmartsiteVO {
    let objRetorno: SmartsiteVO = new SmartsiteVO();
    let objValor = objSmartsite.val();
    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objSmartsite.val()));
    let indEmpresa = Object.keys(obj.empresa);

    objRetorno.smar_sq_id = objSmartsite.key;
    objRetorno.smar_tx_titulo = objValor.smar_tx_titulo;
    objRetorno.smar_tx_subtitulo = objValor.smar_tx_subtitulo;
    objRetorno.smar_tx_conteudo = objValor.smar_tx_conteudo;
    objRetorno.smar_tx_imagem1 = objValor.smar_tx_imagem1;
    objRetorno.smar_in_preco = objValor.smar_in_preco;
    objRetorno.empresa.empr_sq_id = objValor.empresa[indEmpresa[0]].empr_sq_id;
    objRetorno.empresa.empr_nm_razaosocial = objValor.empresa[indEmpresa[0]].empr_nm_razaosocial;
    return objRetorno;
  }

  criaEstruturaJSON(model) {
    let json: string;
    json = 
    '{' +
      '"smar_sq_id":"' + model.smar_sq_id + '",' +
      '"smar_tx_titulo":"' + model.smar_tx_titulo + '",' +
      '"smar_tx_subtitulo":"' + model.smar_tx_subtitulo + '",' +
      '"smar_tx_conteudo":"' + model.smar_tx_conteudo + '",' +
      '"smar_tx_imagem1":"' + model.smar_tx_imagem1 + '",' +
      '"smar_in_preco":' + model.smar_in_preco + ',' +
      '"empresa": {"' + model.empresa.empr_sq_id + '": ' +
        '{' + 
        '"empr_sq_id":"' + model.empresa.empr_sq_id + '",' +
        '"empr_nm_razaosocial":"' + model.empresa.empr_nm_razaosocial + '"' +
        '}}'
    json = json + '}';
    console.log('JSON criado da smartsite=', json);

    let convertJSON = ''; 
    convertJSON = JSON.parse(json);
    return convertJSON;
  }
  
}