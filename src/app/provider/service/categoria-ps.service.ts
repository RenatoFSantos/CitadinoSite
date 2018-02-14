import { CtdFuncoes } from './../../../ctd-funcoes';
import { Observable } from 'rxjs/Observable';
import { FirebaseService } from './../database/firebase.service';
import { Injectable, Component } from '@angular/core';

import { CategoriaPSVO } from './../../model/categoriapsVO';
import * as firebase from 'firebase';

@Injectable()
export class CategoriaPSService {

  categoriaps: CategoriaPSVO[];

  constructor(private fbSrv: FirebaseService) {
  }

  getTotalRegistros() {
    let result = 0;
    return firebase.database().ref('/categoriaps').orderByChild('caps_nm_pesquisa').once('value').then((categoriapss) => {
      if(categoriapss.val()) {
        let keys = Object.keys(categoriapss.val());
        result = keys.length;
      }
      return result;
    })    
  }

  getCategorias() {
    return firebase.database().ref('/categoriaps').orderByChild('caps_nm_pesquisa').once('value').then((categoriapss) => {
       return categoriapss;
    },
    err => {
       throw 'Não existem categoriapss cadastradas.';
    });
  }

  getCategoriasFiltro(filtro: string) {
    return firebase.database().ref('/categoriaps').orderByChild('caps_nm_pesquisa').startAt(filtro).endAt(filtro + '\uf8ff').once('value').then((categoriapss) => {
       return categoriapss;
    },
    err => {
       throw 'Não existem categoriapss cadastradas.';
    });
  }

  getCategoria(id: string) {
    return firebase.database().ref('/categoriaps/' + id).once('value').then((categoriaps) => {
       return categoriaps;
    },
    err => {
       throw 'Categoria não encontrada!';
    });    

  }

  removendoCategoria(id: string) {
    var objRef = firebase.database().ref('/categoriaps/' + id)
    return objRef.remove();
  }

  atualizarCategoria(categoriaps: CategoriaPSVO, tipo: string):Promise<boolean> {
      return new Promise((resolve) => {
        let refReg;
        let update = {};
        let obj: CategoriaPSVO = new CategoriaPSVO();
        obj.caps_sq_id = categoriaps.caps_sq_id;
        obj.caps_nm_categoria = categoriaps.caps_nm_categoria;
        if(tipo=='I') {
          refReg = firebase.database().ref().child('categoriaps').push().key;
          categoriaps.caps_sq_id = refReg;
        } else {
          refReg = categoriaps.caps_sq_id;
        }
        update[`/categoriaps/${refReg}/caps_sq_id`] = categoriaps.caps_sq_id;
        update[`/categoriaps/${refReg}/caps_nm_categoria`] = categoriaps.caps_nm_categoria;
        update[`/categoriaps/${refReg}/caps_nm_pesquisa`] = (CtdFuncoes.removerAcento(categoriaps.caps_nm_categoria)).toLowerCase();
        firebase.database().ref().update(update);
        resolve(true);
      });
  }
  
  buscar(term: string) {
     return firebase.database().ref('categoriaps').orderByChild('caps_nm_categoria').startAt(term).endAt(term + '\uf8ff').once('value');
  }

  buscarCategoria(term: string) {
     return firebase.database().ref().child('categoriaps').orderByChild('caps_nm_categoria').startAt(term).endAt(term + '\uf8ff').once('value', snap => snap.val());
  }

  allCategorias():Observable<CategoriaPSVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('/categoriaps').once('value', snap => {
        return observer.next(snap);
      })
    });
  }

  search(term:string):Observable<CategoriaPSVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('categoriaps').orderByChild('caps_nm_categoria').startAt(term).endAt(term + '\uf8ff').once('value', snap => {          
        observer.next(snap);
    })
    })
  }

  criaEstruturaJSON(model) {
    let json: string;
    json = 
    '{' +
      '"caps_sq_id":"' + model.caps_sq_id + '",' +
      '"caps_nm_categoriaps":"' + model.caps_nm_categoriaps + '",' +
      '"caps_nm_pesquisa":"' + model.caps_nm_pesquisa.toLowerCase() +
    '}'
    let convertJSON = JSON.parse(json);
    return convertJSON;
  }

  carregaObjeto(objCategoriaPS):CategoriaPSVO {
    let objRetorno: CategoriaPSVO = new CategoriaPSVO();
    let objValor = objCategoriaPS.val();
    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objCategoriaPS.val()));
    objRetorno.caps_sq_id = objCategoriaPS.key;
    objRetorno.caps_nm_categoria= objValor.caps_nm_categoria;
    objRetorno.caps_nm_pesquisa= objValor.caps_nm_pesquisa;    
    return objRetorno;
  }
  
}
