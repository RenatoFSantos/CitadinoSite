import { Observable } from 'rxjs/Observable';
import { PlanoVO } from './../../model/planoVO';
import { FirebaseService } from './../database/firebase.service';
import { Injectable, Component } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class PlanoService {

  constructor(private fbSrv: FirebaseService) {
  }

  getTotalRegistros() {
    let result = 0;
    return firebase.database().ref('/plano').orderByChild('empr_nm_razaosocial').once('value').then((planos) => {
      if(planos.val()) {
        let keys = Object.keys(planos.val());
        result = keys.length;
      }
      return result;
    })    
  }  

  getPlanos() {
    return firebase.database().ref('/plano').once('value').then((planos) => {
       return planos;
    },
    err => {
       throw 'Não existem planos cadastradas.';
    });
  }

  getPlanosFiltro(filtro: string) {
    return firebase.database().ref('/plano').orderByChild('plan_nm_plano').startAt(filtro).endAt(filtro + '\uf8ff').once('value').then((planos) => {
       return planos;
    },
    err => {
       throw 'Não existem planos cadastrados.';
    });
  }    
  

  getPlano(id: string) {
    return firebase.database().ref('/plano/' + id).once('value').then((plano) => {
       return plano;
    },
    err => {
       throw 'Plano não encontrado!';
    });    

  }

  removendoPlano(id: string) {
    var objRef = firebase.database().ref('/plano/' + id)
    return objRef.remove();
  }

  atualizarPlano(plano: PlanoVO, tipo: string) {
      let result;
      let refReg;
      if(tipo=='I') {
        refReg = firebase.database().ref().child('plano').push().key;
        plano.plan_sq_id = refReg;
      } else {
        refReg = plano.plan_sq_id;
      }
      let modelJSON = this.criaEstruturaJSON(plano);
      let update = {};
     
      update[`/plano/${refReg}/plan_sq_id`] = plano.plan_sq_id;
      update[`/plano/${refReg}/plan_nm_plano`] = plano.plan_nm_plano;
      update[`/plano/${refReg}/plan_ds_descricao`] = plano.plan_ds_descricao;
      update[`/plano/${refReg}/plan_vl_plano`] = plano.plan_vl_plano;
      update[`/plano/${refReg}/plan_tp_valor`] = plano.plan_tp_valor;
      update[`/plano/${refReg}/plan_in_smartsite`] = plano.plan_in_smartsite;
      update[`/plano/${refReg}/plan_in_tabpreco`] = plano.plan_in_tabpreco;
      update[`/plano/${refReg}/plan_in_ecommerce`] = plano.plan_in_ecommerce;
 
      result =  firebase.database().ref().update(update);
      return result;

  }

  allPlanos():Observable<PlanoVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('/plano').once('value', snap => {
        return observer.next(snap);
      })
    });
  }

  search(term:string):Observable<PlanoVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('plano').orderByChild('plan_nm_plano').startAt(term).endAt(term + '\uf8ff').once('value', snap => {          
        observer.next(snap);
    })
    });
  }

  criaEstruturaJSON(model) {
    let json: string;
    json = 
    '{' +
      '"plan_sq_id":"' + model.plan_sq_id + '",' +
      '"plan_nm_plano":"' + model.plan_nm_plano + '",' +
      '"plan_ds_descricao":"' + model.plan_ds_descricao + '",' +
      '"plan_vl_plano":"' + model.plan_vl_plano + '",' +
      '"plan_tp_valor":"' + model.plan_tp_valor + '",' +
      '"plan_in_smartsite":' + model.plan_in_smartsite + ',' +
      '"plan_in_tabpreco":' + model.plan_in_tabpreco + ',' +
      '"plan_in_ecommerce":' + model.plan_in_ecommerce + 
    '}'
    let convertJSON = JSON.parse(json);
    return convertJSON;
  }

}