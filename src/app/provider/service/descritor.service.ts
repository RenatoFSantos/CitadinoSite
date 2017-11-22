import { CtdFuncoes } from './../../../ctd-funcoes';
import { Observable } from 'rxjs/Observable';
import { DescritorVO } from './../../model/descritorVO';
import { FirebaseService } from './../database/firebase.service';
import { Injectable, Component } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class DescritorService {
  
  listaDescritors: string[] = [];
  descritor: any;

  constructor(private fbSrv: FirebaseService) {
  }

  getTotalRegistros() {
    let result = 0;
    return firebase.database().ref('/descritor').orderByChild('desc_nm_pesquisa').once('value').then((descritores) => {
      if(descritores.val()) {
        let keys = Object.keys(descritores.val());
        result = keys.length;
      }
      return result;
    })    
  }

  getDescritors() {
    return firebase.database().ref('/descritor').orderByChild('desc_nm_pesquisa').once('value').then((descritores) => {
       return descritores;
    },
    err => {
       throw 'Não existem descritores cadastradas.';
    });
  }

  getDescritorsFiltro(filtro: string) {
    return firebase.database().ref('/descritor').orderByChild('desc_nm_pesquisa').startAt(filtro).endAt(filtro + '\uf8ff').once('value').then((descritores) => {
       return descritores;
    },
    err => {
       throw 'Não existem descritores cadastrados.';
    });
  }

  getDescritor(id: string) {
    return firebase.database().ref('/descritor/' + id).once('value').then((descritor) => {
       return descritor;
    },
    err => {
       throw 'Descritor não encontrada!';
    });    

  }

  getDescritoresPublicos() {
    return firebase.database().ref(`/descritor/`).orderByChild('desc_in_privado').equalTo(false).once('value').then((descritores) => {
      return descritores;
    })
  }

  removendoDescritor(id: string) {
    var objRef = firebase.database().ref('/descritor/' + id)
    return objRef.remove();
  }

  atualizarDescritor(descritor: DescritorVO, tipo: string) {
      let result;
      let refReg;
      //alert(new Date().getTime());

      if(tipo=='I') {
        refReg = firebase.database().ref().child('descritor').push().key;
        descritor.desc_sq_id = refReg;
      } else {
        refReg = descritor.desc_sq_id;
      }
      // Verificando se Indicador de Privado está nulo
      if(!descritor.desc_in_privado) {
        descritor.desc_in_privado = false;
      }

      // --- Removendo acentos do nome do descritor
      descritor.desc_nm_pesquisa = CtdFuncoes.removerAcento(descritor.desc_nm_descritor);
      

      let modelJSON = this.criaEstruturaJSON(descritor);
      let update = {};

      update[`/descritor/${refReg}`] = modelJSON;
      result =  firebase.database().ref().update(update);
      return result;
  }
  
  buscar(term: string) {
     return firebase.database().ref('descritor').orderByChild('desc_nm_descritor').startAt(term).endAt(term + '\uf8ff').once('value');
  }

  buscarDescritor(term: string) {
     return firebase.database().ref().child('descritor').orderByChild('desc_nm_descritor').startAt(term).endAt(term + '\uf8ff').once('value', snap => snap.val());
  }

  allDescritors():Observable<DescritorVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('/descritor').once('value', snap => {
        return observer.next(snap);
      })
    });
  }

  search(term:string):Observable<DescritorVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('/descritor').orderByChild('desc_nm_descritor').startAt(term).endAt(term + '\uf8ff').once('value', snap => {          
        observer.next(snap);
    })
    })
  }

  criaEstruturaJSON(model) {
    let json: string;
    json = 
    '{' +
      '"desc_sq_id":"' + model.desc_sq_id + '",' +
      '"desc_nm_descritor":"' + model.desc_nm_descritor + '",' +
      '"desc_nm_pesquisa":"' + model.desc_nm_pesquisa.toLowerCase() + '",' +
      '"desc_in_privado":' + model.desc_in_privado + 
    '}'
    let convertJSON = JSON.parse(json);
    return convertJSON;
  }
  

}