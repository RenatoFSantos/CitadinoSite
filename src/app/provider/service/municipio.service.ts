import { Observable } from 'rxjs/Observable';
import { MunicipioVO } from './../../model/municipioVO';
import { FirebaseService } from './../database/firebase.service';
import { Injectable, Component } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class MunicipioService {
  
  listaMunicipios: string[] = [];
  municipio: any;

  constructor(private fbSrv: FirebaseService) {
  }

  getTotalRegistros() {
    let result = 0;
    return firebase.database().ref('/municipio').orderByChild('muni_nm_municipio').once('value').then((municipios) => {
      if(municipios.val()) {
        let keys = Object.keys(municipios.val());
        result = keys.length;
      }
      return result;
    })    
  }

  getMunicipios() {
    return firebase.database().ref('/municipio').once('value').then((municipios) => {
       return municipios;
    },
    err => {
       throw 'Não existem municipios cadastradas.';
    });
  }

  getMunicipiosFiltro(filtro: string) {
    return firebase.database().ref('/municipio').orderByChild('muni_nm_municipio').startAt(filtro).endAt(filtro + '\uf8ff').once('value').then((municipios) => {
       return municipios;
    },
    err => {
       throw 'Não existem municípios cadastrados.';
    });
  }  

  getMunicipio(id: string) {
    return firebase.database().ref('/municipio/' + id).once('value').then((municipio) => {
       return municipio;
    },
    err => {
       throw 'Municipio não encontrada!';
    });    

  }

  removendoMunicipio(id: string) {
    var objRef = firebase.database().ref('/municipio/' + id)
    return objRef.remove();
  }

  atualizarMunicipio(municipio: MunicipioVO, tipo:string) {
      let refReg;
      let update = {};
      let obj: MunicipioVO = new MunicipioVO();
      obj.muni_sq_id = municipio.muni_sq_id;
      obj.muni_nm_municipio = municipio.muni_nm_municipio;
      if(tipo=='I') {
        refReg = firebase.database().ref().child('municipio').push().key;
        municipio.muni_sq_id = refReg;
      } else {
        refReg = municipio.muni_sq_id;
      }
      update[`/municipio/${refReg}/muni_sq_id`] = municipio.muni_sq_id;
      update[`/municipio/${refReg}/muni_nm_municipio`] = municipio.muni_nm_municipio;
      return firebase.database().ref().update(update);
  }
  
  buscar(term: string) {
     return firebase.database().ref('municipio').orderByChild('muni_nm_municipio').startAt(term).endAt(term + '\uf8ff').once('value');
  }

  buscarMunicipio(term: string) {
     return firebase.database().ref().child('municipio').orderByChild('muni_nm_municipio').startAt(term).endAt(term + '\uf8ff').once('value', snap => snap.val());
  }

  allMunicipios():Observable<MunicipioVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('/municipio').once('value', snap => {
        return observer.next(snap);
      })
    });
  }

  search(term:string):Observable<MunicipioVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('municipio').orderByChild('muni_nm_municipio').startAt(term).endAt(term + '\uf8ff').once('value', snap => {          
        observer.next(snap);
    })
    })
  }

  criaEstruturaJSON(model) {
    let json: string;

    json = 
    '{' +
      '"muni_sq_id":"' + model.muni_sq_id + '",' +
      '"muni_nm_municipio":"' + model.muni_nm_municipio + '"' +
    '}'
    let convertJSON = JSON.parse(json);
    return convertJSON;
  }
  

}