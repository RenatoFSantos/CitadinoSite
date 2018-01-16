import { CategoriaPSVO } from './../../model/categoriapsVO';
import { TabelaPrecoVO } from './../../model/tabelaPrecoVO';
import { EmpresaVO } from './../../model/empresaVO';
import { CtdFuncoes } from './../../../ctd-funcoes';
import { Observable } from 'rxjs/Observable';
import { FirebaseService } from './../database/firebase.service';
import { Injectable, Component } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class TabelaPrecoService {

  metadata = {
    contentType: 'image/jpeg'
  };  

  constructor(private fbSrv: FirebaseService) {

  }

  getTotalRegistros(refEmp: string) {
    let result = 0;
    return firebase.database().ref(`/tabelapreco/${refEmp}`).orderByChild('tapr_nm_item').once('value').then((itens) => {
      if(itens.val()) {
        let keys = Object.keys(itens.val());
        result = keys.length;
      }
      return result;
    })    
  }
  
  getItensNome(nome: string, refEmp: string) {
    return firebase.database().ref(`/tabelapreco/${refEmp}`).orderByChild('tapr_nm_item').equalTo(nome).once('value')
      .then(itens => {
        return itens;
      })
  }

  getItens(refEmp) {
    return firebase.database().ref(`/tabelapreco/${refEmp}`).orderByChild('tapr_nm_item').once('value').then((itens) => {
       return itens;
    },
    err => {
       throw 'Não existem itens cadastradas.';
    });
  }

  getItensFiltro(filtro: string, refEmp: string) {
    return firebase.database().ref(`/tabelapreco/${refEmp}`).orderByChild('tapr_nm_item').startAt(filtro).endAt(filtro + '\uf8ff').once('value').then((itens) => {
       return itens;
    },
    err => {
       throw 'Não existem itens cadastradas.';
    });
  }  

  getItem(id: string, refEmp: string) {
    return firebase.database().ref(`/tabelapreco/${refEmp}/${id}`).once('value').then((item) => {
       return item;
    },
    err => {
       throw 'Item não encontrado.';
    });    
  }

  removendoItem(id: string, refEmp: string) {
    var objRef = firebase.database().ref(`/tabelapreco/${refEmp}/${id}`)
    return objRef.remove();
  }
  
  atualizarTabelaPreco(tabelaPreco: TabelaPrecoVO, tipo: string, empresa: EmpresaVO) {
    let objRef;
    let result;
    let refTab;
    let update = {};
    let modelJSON;

    // Verificando se indicador SOBCONSULTA está nulo
    if(tabelaPreco.tapr_in_sobconsulta===undefined || tabelaPreco.tapr_in_sobconsulta===null) {
      tabelaPreco.tapr_in_sobconsulta = false;
    }

    // Verificando se empresa está carregada no objeto
    console.log('Validando conteudo variável tabelaPreco.empresa.empr_sq_id=', tabelaPreco.empresa.empr_sq_id)
    if(tabelaPreco.empresa.empr_sq_id===undefined || tabelaPreco.empresa.empr_sq_id===null || tabelaPreco.empresa.empr_sq_id==''){
      console.log('Atualizando valores da empresa no modelo tabelaPreco', empresa.empr_sq_id);
      tabelaPreco.empresa.empr_sq_id = empresa.empr_sq_id;
      tabelaPreco.empresa.empr_nm_razaosocial = empresa.empr_nm_razaosocial;
    }

    if(tipo=='I') {
      refTab = firebase.database().ref(`tabelapreco/${empresa.empr_sq_id}`).push().key;
      tabelaPreco.tapr_sq_id = refTab;

      // Criando o modelo JSON da tabelaPreco
      modelJSON = this.criaEstruturaJSON(tabelaPreco);
    } else {
      refTab = tabelaPreco.tapr_sq_id;
      // Criando o modelo JSON da tabelaPreco
      modelJSON = this.criaEstruturaJSON(tabelaPreco);
    }
    
    // Atualizando dados da TabelaPreco
    update[`/tabelapreco/${empresa.empr_sq_id}/${refTab}`] = modelJSON;

    result =  firebase.database().ref().update(update);
    return result;
  }

  atualizarImagemTabelaPreco(id, txImagem, dir, refEmp) {
    console.log('Imagem a ser atualizada=', txImagem);
    firebase.database().ref().child(`/tabelapreco/${refEmp}/${id}`).update({tapr_tx_imagem: txImagem});
  }

  uploadImagensTabelaPreco(file, dir, id, refEmp):Promise<string> {
    let result: string = '';
    let metadata = {
        contentType: 'image/png',
        name: '',
        cacheControl: 'no-cache',
    };  
    return new Promise((resolve) => {
      let progress: number = 0;
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child(`images/tabelapreco/${refEmp}/${id}/${file.name}`);
      let uploadTask = storageRef.child(`images/tabelapreco/${refEmp}/${id}/${file.name}`).put(file);

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
        result =  downloadURL;
        resolve(result);
      });
    })

  }

  carregaObjeto(objTabelaPreco):TabelaPrecoVO {
    let objRetorno: TabelaPrecoVO = new TabelaPrecoVO();
    let objEmpresa: EmpresaVO;
    let objCategoriaPS: CategoriaPSVO;
    let objValor = objTabelaPreco.val();

    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objTabelaPreco.val()));
    let indEmpresa = Object.keys(obj.empresa);
    let indCategoriaPS = Object.keys(obj.categoriaps);
    objRetorno.tapr_sq_id = objTabelaPreco.key;
    objRetorno.tapr_nm_item = obj.tapr_nm_item;
    objRetorno.tapr_ds_item = obj.tapr_ds_item;
    objRetorno.tapr_tp_item = obj.tapr_tp_item;
    objRetorno.tapr_ds_unidade = obj.tapr_ds_unidade;
    objRetorno.tapr_tx_observacao = obj.tapr_tx_observacao;
    objRetorno.tapr_tx_imagem = obj.tapr_tx_imagem;
    objRetorno.tapr_in_sobconsulta = obj.tapr_in_sobconsulta;
    objRetorno.tapr_vl_unitario = obj.tapr_vl_unitario;
    objRetorno.tapr_vl_perc_desconto = obj.tapr_vl_perc_desconto;
    objRetorno.empresa.empr_sq_id = obj.empresa[indEmpresa[0]].empr_sq_id;
    objRetorno.empresa.empr_nm_razaosocial = obj.empresa[indEmpresa[0]].empr_nm_razaosocial;
    objRetorno.categoriaps.caps_sq_id = obj.categoriaps[indCategoriaPS[0]].caps_sq_id;
    objRetorno.categoriaps.caps_nm_categoria = obj.categoriaps[indCategoriaPS[0]].caps_nm_categoria;
    return objRetorno;
  }

  criaEstruturaJSON(model) {

    let json: string;
    json = 
    '{' +
      '"tapr_sq_id":"' + model.tapr_sq_id + '",' +
      '"tapr_nm_item":"' + model.tapr_nm_item + '",' +
      '"tapr_ds_item":"' + model.tapr_ds_item + '",' +
      '"tapr_ds_unidade":"' + model.tapr_ds_unidade + '",' +
      '"tapr_tp_item":"' + model.tapr_tp_item + '",' +
      '"tapr_vl_unitario":"' + model.tapr_vl_unitario + '",' +
      '"tapr_vl_perc_desconto":"' + model.tapr_vl_perc_desconto + '",' +
      '"tapr_in_sobconsulta":' + model.tapr_in_sobconsulta + ',' +
      '"tapr_tx_observacao":"' + model.tapr_tx_observacao + '",' +
      '"tapr_tx_imagem":"' + model.tapr_tx_imagem + '",' +
      '"empresa": {"' + model.empresa.empr_sq_id + '": ' +
        '{' + 
        '"empr_sq_id":"' + model.empresa.empr_sq_id + '",' +
        '"emp_nm_razaosocial":"' + model.empresa.empr_nm_razaosocial + '"' +
        '}},' +
      '"categoriaps": {"' + model.categoriaps.caps_sq_id + '": ' +
      '{' + 
      '"caps_sq_id":"' + model.categoriaps.caps_sq_id + '",' +
      '"caps_nm_categoria":"' + model.categoriaps.caps_nm_categoria + '"' +
      '}}'
    json = json + '}';
    console.log('JSON criado da tabelaPreco=', json);

    let convertJSON = JSON.parse(json);
    return convertJSON;
  }

}
