import { TipoAnuncioVO } from './../../model/tipoanuncioVO';
import { Observable } from 'rxjs/Observable';
import { FirebaseService } from './../database/firebase.service';
import { Injectable, Component } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class TipoAnuncioService {
  
  listaTipoAnuncios: string[] = [];
  tipoanuncio: any;

  constructor(private fbSrv: FirebaseService) {
  }

  getTotalRegistros() {
    let result = 0;
    return firebase.database().ref('/tipoanuncio').orderByChild('tian_nm_tipoanuncio').once('value').then((tipoanuncios) => {
      if(tipoanuncios.val()) {
        let keys = Object.keys(tipoanuncios.val());
        result = keys.length;
      }
      return result;
    })    
  }

  getTipoAnuncios() {
    return firebase.database().ref('/tipoanuncio').once('value').then((tipoanuncios) => {
       return tipoanuncios;
    },
    err => {
       throw 'Não existem Tipos de Anúncios cadastradas.';
    });
  }

  getTipoAnunciosFiltro(filtro: string) {
    return firebase.database().ref('/tipoanuncio').orderByChild('tian_nm_tipoanuncio').startAt(filtro).endAt(filtro + '\uf8ff').once('value').then((tipoanuncios) => {
       return tipoanuncios;
    },
    err => {
       throw 'Não existem Tipos de Anúncios cadastrados.';
    });
  }  

  getTipoAnuncio(id: string) {
    return firebase.database().ref('/tipoanuncio/' + id).once('value').then((tipoanuncio) => {
       return tipoanuncio;
    },
    err => {
       throw 'Tipo de Anúncio não encontrado!';
    });    

  }

  removendoTipoAnuncio(id: string) {
    var objRef = firebase.database().ref('/tipoanuncio/' + id)
    return objRef.remove();
  }

  atualizarTipoAnuncio(tipoanuncio: TipoAnuncioVO, tipo:string) {
      let refReg;
      let update = {};
      if(tipo=='I') {
        refReg = firebase.database().ref().child('tipoanuncio').push().key;
        tipoanuncio.tian_sq_id = refReg;
      } else {
        refReg = tipoanuncio.tian_sq_id;
      }
      update[`/tipoanuncio/${refReg}/tian_sq_id`] = tipoanuncio.tian_sq_id;
      update[`/tipoanuncio/${refReg}/tian_nm_tipoanuncio`] = tipoanuncio.tian_nm_tipoanuncio;
      update[`/tipoanuncio/${refReg}/tian_nr_creditos`] = tipoanuncio.tian_nr_creditos;
      update[`/tipoanuncio/${refReg}/tian_nr_dias`] = tipoanuncio.tian_nr_dias;
      update[`/tipoanuncio/${refReg}/tian_in_tipo`] = tipoanuncio.tian_in_tipo;
      return firebase.database().ref().update(update);
  }
  
  buscar(term: string) {
     return firebase.database().ref('tipoanuncio').orderByChild('tian_nm_tipoanuncio').startAt(term).endAt(term + '\uf8ff').once('value');
  }

  buscarTipoAnuncio(term: string) {
     return firebase.database().ref().child('tipoanuncio').orderByChild('tian_nm_tipoanuncio').startAt(term).endAt(term + '\uf8ff').once('value', snap => snap.val());
  }

  allTipoAnuncios():Observable<TipoAnuncioVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('/tipoanuncio').once('value', snap => {
        return observer.next(snap);
      })
    });
  }

  search(term:string):Observable<TipoAnuncioVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('tipoanuncio').orderByChild('tian_nm_tipoanuncio').startAt(term).endAt(term + '\uf8ff').once('value', snap => {          
        observer.next(snap);
    })
    })
  }

  criaEstruturaJSON(model) {
    let json: string;

    json = 
    '{' +
      '"tian_sq_id":"' + model.tian_sq_id + '",' +
      '"tian_nm_tipoanuncio":"' + model.tian_nm_tipoanuncio + '",' +
      '"tian_nr_creditos":' + model.tian_nr_creditos +',' +
      '"tian_nr_dias":' + model.tian_nr_dias + ',' +
      '"tian_in_tipo":"' + model.tian_in_tipo + '"' +
    '}'
    let convertJSON = JSON.parse(json);
    return convertJSON;
  }
  

}