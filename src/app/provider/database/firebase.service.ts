import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class FirebaseService {
  public db: any;
  constructor() { }

  init() {
    // const fbConf = {
    //   apiKey: "AIzaSyByJsiNAYX6741uxiw-TSokabtN64DeTMk",
    //   authDomain: "citadino-c0c79.firebaseapp.com",
    //   databaseURL: "https://citadino-c0c79.firebaseio.com",
    //   storageBucket: "citadino-c0c79.appspot.com",
    //   messagingSenderId: "75420061601"
    // };

    // firebase.initializeApp(fbConf);
    // this.db = firebase.database().ref('/');
  }


  //Retorna um json do objeto
  public pesquisarPorId(tabela: string, uid: string) {
    return firebase.database().ref("'" + tabela + '/' + uid + "'").once('value').then(
      (dataSnapshot: any) => {
        if (dataSnapshot.val() != null) {
          console.log('Encontrou registro procurado!');
          return dataSnapshot.val();
        }
        else {
          throw 'Usuário não encontrado';
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  //Retorna os dados de uma tabela
  public retornaDadosTabela(tabela: string): firebase.database.Reference {
    return firebase.database().ref("'" + tabela + "'");
  }

  //Retorna os dados de uma tabela
  public retornaRegistroTabela(tabela: string, uid: string): firebase.database.Reference {
    return firebase.database().ref("'" + tabela + '/' + uid + "'");
  }

  public getConnect() {
    return firebase;
  }

}
