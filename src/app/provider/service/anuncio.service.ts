import { CtdFuncoes } from './../../../ctd-funcoes';
import { AgendaVO } from './../../model/agendaVO';
import { Observable } from 'rxjs/Observable';
import { AnuncioVO } from './../../model/anuncioVO';
import { FirebaseService } from './../database/firebase.service';
import { Injectable, Component } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class AnuncioService {

  anuncio: AnuncioVO;
  agenda: AgendaVO;

  metadata = {
    contentType: 'image/jpeg'
  };  

  constructor(private fbSrv: FirebaseService) {
  }

  getTotalRegistros() {
    let result = 0;
    return firebase.database().ref('/anuncio').orderByChild('anun_ds_anuncio').once('value').then((anuncios) => {
      if(anuncios.val()) {
        let keys = Object.keys(anuncios.val());
        result = keys.length;
      }
      return result;
    })    
  }  

  getAnuncios() {
    return firebase.database().ref('/anuncio').orderByChild('anun_ds_anuncio').once('value').then((anuncios) => {
       return anuncios;
    },
    err => {
       throw 'Não existem anuncios cadastradas.';
    });
  }

  getAnunciosFiltro(filtro: string) {
    return firebase.database().ref('/anuncio').orderByChild('anun_ds_anuncio').startAt(filtro).endAt(filtro + '\uf8ff').once('value').then((anuncios) => {
       return anuncios;
    },
    err => {
       throw 'Não existem anúncios cadastradas.';
    });
  }    

  getAnuncio(id: string) {
    return firebase.database().ref('/anuncio/' + id).once('value').then((anuncio) => {
       return anuncio;
    },
    err => {
       throw 'Anuncios não encontradas.';
    });    

  }
  
  getAnuncioAgendas(idAnuncio: string) {
    return firebase.database().ref(`/anuncio/${idAnuncio}`).child('agenda').once('value')
      .then((agendas) => { 
        return agendas
      },
      err => {
        throw 'Descritores inexistentes!';
      });
  }

  removendoAnuncio(obj: AnuncioVO) {
    var objRef = firebase.database().ref(`/anuncio/${obj.anun_sq_id}`)
    return objRef.remove();
  }

  removerAnuncioAgenda(anuncio: AnuncioVO, agenda: AgendaVO) {
    let update = {};

    // Removendo as agendas relacionadas

    update[`/anuncio/${anuncio.anun_sq_id}/agenda/${agenda.agen_sq_id}`] = null;
    update[`/agenda/${agenda.agen_sq_id}`] = null;

    return firebase.database().ref().update(update);

  }
  
  atualizarAnuncio(anuncio: AnuncioVO, anuncioOld: AnuncioVO, tipo: string) {
      let objRef;
      let result;
      let refAnun;
      let refDesc;
      let update = {};
      let modelJSON = '';
      this.anuncio = new AnuncioVO();

      if(tipo=='I') {
        refAnun = firebase.database().ref().child('anuncio').push().key;
        anuncio.anun_sq_id = refAnun;
      } else {
        refAnun = anuncio.anun_sq_id;
      }

      if(anuncio.anun_tx_urlslide4==undefined) {
        anuncio.anun_tx_urlslide4='';
      }

      if(anuncio.anun_tx_urlcupomaberto==undefined) {
        anuncio.anun_tx_urlcupomaberto='';
      }

      if(anuncio.anun_tx_urlcupomfechado==undefined) {
        anuncio.anun_tx_urlcupomfechado='';
      }

      if(anuncio.anun_nr_totalcupom==undefined) {
        anuncio.anun_nr_totalcupom=0;
      }      

      if(anuncio.anun_nr_totalpremio==undefined) {
        anuncio.anun_nr_totalpremio=0;
      } 

      // Criando o modelo JSON da anuncio
      modelJSON = this.criaEstruturaJSON(anuncio);
      
      // Atualizando dados da Anuncio
      update[`/anuncio/${refAnun}`] = modelJSON;

      result =  firebase.database().ref().update(update);
      return result;
  }

  atualizarAnuncioAgenda(anuncio: AnuncioVO, agenda: AgendaVO, tipo: string) {
      let result;
      let update = {};
      let refReg;

      // --- Atribui o anúncio a agenda
      agenda.anuncio.anun_sq_id = anuncio.anun_sq_id;
      agenda.anuncio.anun_ds_anuncio = anuncio.anun_ds_anuncio;

      if(tipo=='I') {
        refReg = firebase.database().ref().child('agenda').push().key;
        agenda.agen_sq_id = refReg;
      } else {
        refReg = agenda.agen_sq_id;
      }

      let modelJSONAgenda = this.criaEstruturaJSONAgenda(agenda);
      update[`/agenda/${refReg}`] = modelJSONAgenda;
      update[`/anuncio/${anuncio.anun_sq_id}/agenda/${refReg}`] = true;
      result =  firebase.database().ref().update(update);

      return result;
  }  

  atualizarNomeArquivo(idAnuncio, txArquivo, txDir) {
      switch(txDir) {
        case 'icone':
          firebase.database().ref().child(`anuncio/${idAnuncio}`).update({anun_tx_urlicone: txArquivo});
          break;
        case 'thumbnail':
          firebase.database().ref().child(`anuncio/${idAnuncio}`).update({anun_tx_urlthumbnail: txArquivo});
          break;
        case 'banner':
          firebase.database().ref().child(`anuncio/${idAnuncio}`).update({anun_tx_urlbanner: txArquivo});
          break;
        case 'avatar':
          firebase.database().ref().child(`anuncio/${idAnuncio}`).update({anun_tx_urlavatar: txArquivo});
          break;
        case 'slide1':
          firebase.database().ref().child(`anuncio/${idAnuncio}`).update({anun_tx_urlslide1: txArquivo});
          break;
        case 'slide2':
          firebase.database().ref().child(`anuncio/${idAnuncio}`).update({anun_tx_urlslide2: txArquivo});
          break;
        case 'slide3':
          firebase.database().ref().child(`anuncio/${idAnuncio}`).update({anun_tx_urlslide3: txArquivo});
          break;
        case 'slide4':
          firebase.database().ref().child(`anuncio/${idAnuncio}`).update({anun_tx_urlslide4: txArquivo});
          break;
        case 'cupomaberto':
          firebase.database().ref().child(`anuncio/${idAnuncio}`).update({anun_tx_urlcupomaberto: txArquivo});
          break;
        case 'cupomfechado':
          firebase.database().ref().child(`anuncio/${idAnuncio}`).update({anun_tx_urlcupomfechado: txArquivo});
          break;
        default:
          break;
      }
  }
  
  uploadImagemAnuncio(file, dir, idAnuncio):Promise<string> {
      let result: string = '';
      let metadata = {
          contentType: 'image/png',
          name: '',
          cacheControl: 'no-cache',
      };  
      return new Promise((resolve) => {
        let progress: number = 0;
        let storageRef = firebase.storage().ref();
        let imageRef = storageRef.child(`images/anuncio/${idAnuncio}/${dir}/${file.name}`);
        let uploadTask = storageRef.child(`images/anuncio/${idAnuncio}/${dir}/${file.name}`).put(file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function(snapshot) {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
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

  allAnuncios():Observable<AnuncioVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('/anuncio').once('value', snap => {
        return observer.next(snap);
      })
    });
  }

  search(term:string):Observable<AnuncioVO[]> {
    return Observable.create((observer) => {
      firebase.database().ref('anuncio').orderByChild('anun_tx_titulo').startAt(term).endAt(term + '\uf8ff').once('value', snap => {          
        observer.next(snap);
    })
    })
  }

  carregaObjeto(objAnuncio):AnuncioVO {
    let objRetorno: AnuncioVO = new AnuncioVO();
    let objValor = objAnuncio.val();
    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objAnuncio.val()));
    let indEmpresa = Object.keys(obj.empresa);
    let indMunicipio = Object.keys(obj.municipio);
    let indTipoAnuncio = Object.keys(obj.tipoanuncio);
    let indAgenda;
    if(objValor.agenda!=null) {
      indAgenda = Object.keys(obj.agenda);
    }

    objRetorno.anun_sq_id = objAnuncio.key;
    objRetorno.anun_ds_anuncio = objValor.anun_ds_anuncio;
    objRetorno.anun_tx_titulo = objValor.anun_tx_titulo;
    objRetorno.anun_tx_subtitulo = objValor.anun_tx_subtitulo;
    objRetorno.anun_tx_texto = objValor.anun_tx_texto;
    objRetorno.anun_tx_urlavatar = objValor.anun_tx_urlavatar;
    objRetorno.anun_tx_urlthumbnail = objValor.anun_tx_urlthumbnail;
    objRetorno.anun_tx_urlbanner = objValor.anun_tx_urlbanner;
    objRetorno.anun_tx_urlicone = objValor.anun_tx_urlicone;
    objRetorno.anun_tx_urlslide1 = objValor.anun_tx_urlslide1;
    objRetorno.anun_tx_urlslide2 = objValor.anun_tx_urlslide2;
    objRetorno.anun_tx_urlslide3 = objValor.anun_tx_urlslide3;
    objRetorno.anun_tx_urlslide4 = objValor.anun_tx_urlslide4;
    objRetorno.anun_tx_urlcupomaberto = objValor.anun_tx_urlcupomaberto;
    objRetorno.anun_tx_urlcupomfechado = objValor.anun_tx_urlcupomfechado;
    objRetorno.anun_nr_totalcupom = objValor.anun_nr_totalcupom;
    objRetorno.anun_nr_totalpremio = objValor.anun_nr_totalpremio;
    objRetorno.anun_nr_curtidas = objValor.anun_nr_curtidas;
    objRetorno.anun_nr_salvos = objValor.anun_nr_salvos;
    objRetorno.anun_nr_visitas = objValor.anun_nr_visitas;
    objRetorno.anun_in_status = objValor.anun_in_status;
    objRetorno.empresa.empr_sq_id = objValor.empresa[indEmpresa[0]].empr_sq_id;
    objRetorno.empresa.empr_nm_razaosocial = objValor.empresa[indEmpresa[0]].empr_nm_razaosocial;
    objRetorno.anun_in_smartsite = objValor.anun_in_smartsite;
    objRetorno.tipoanuncio.tian_sq_id = objValor.tipoanuncio[indTipoAnuncio[0]].tian_sq_id;
    objRetorno.tipoanuncio.tian_nm_tipoanuncio = objValor.tipoanuncio[indTipoAnuncio[0]].tian_nm_tipoanuncio;
    objRetorno.municipio.muni_sq_id = objValor.municipio[indMunicipio[0]].muni_sq_id;
    objRetorno.municipio.muni_nm_municipio = objValor.municipio[indMunicipio[0]].muni_nm_municipio;
    return objRetorno;
  }

  criaEstruturaJSON(model) {
    let json: string;
    json = 
    '{' +
      '"anun_sq_id":"' + model.anun_sq_id + '",' +
      '"anun_ds_anuncio":"' + model.anun_ds_anuncio + '",' +
      '"anun_tx_titulo":"' + model.anun_tx_titulo + '",' +
      '"anun_tx_subtitulo":"' + model.anun_tx_subtitulo + '",' +
      '"anun_tx_texto":"' + model.anun_tx_texto + '",' +
      '"anun_tx_urlavatar":"' + model.anun_tx_urlavatar + '",' +
      '"anun_tx_urlthumbnail":"' + model.anun_tx_urlthumbnail + '",' +
      '"anun_tx_urlbanner":"' + model.anun_tx_urlbanner + '",' +
      '"anun_tx_urlicone":"' + model.anun_tx_urlicone + '",' +
      '"anun_tx_urlslide1":"' + model.anun_tx_urlslide1 + '",' +
      '"anun_tx_urlslide2":"' + model.anun_tx_urlslide2 + '",' +
      '"anun_tx_urlslide3":"' + model.anun_tx_urlslide3 + '",' +
      '"anun_tx_urlslide4":"' + model.anun_tx_urlslide4 + '",' +
      '"anun_tx_urlcupomaberto":"' + model.anun_tx_urlcupomaberto + '",' +
      '"anun_tx_urlcupomfechado":"' + model.anun_tx_urlcupomfechado + '",' +
      '"anun_nr_totalcupom":' + model.anun_nr_totalcupom + ',' +
      '"anun_nr_totalpremio":' + model.anun_nr_totalpremio + ',' +
      '"anun_nr_curtidas":' + model.anun_nr_curtidas + ',' +
      '"anun_nr_salvos":' + model.anun_nr_salvos + ',' +
      '"anun_nr_visitas":' + model.anun_nr_visitas + ',' +
      '"anun_in_status":"' + model.anun_in_status + '",' +
      '"anun_in_smartsite":' + model.anun_in_smartsite + ',' +
      '"empresa": {"' + model.empresa.empr_sq_id + '": ' +
        '{' + 
        '"empr_sq_id":"' + model.empresa.empr_sq_id + '",' +
        '"empr_nm_razaosocial":"' + model.empresa.empr_nm_razaosocial + '"' +
        '}},' +
      '"municipio": {"' + model.municipio.muni_sq_id + '": ' +
        '{' + 
        '"muni_sq_id":"' + model.municipio.muni_sq_id + '",' +
        '"muni_nm_municipio":"' + model.municipio.muni_nm_municipio + '"' +
        '}},' +
      '"tipoanuncio": {"' + model.tipoanuncio.tian_sq_id + '": ' +
        '{' + 
        '"tian_sq_id":"' + model.tipoanuncio.tian_sq_id + '",' +
        '"tian_nm_tipoanuncio":"' + model.tipoanuncio.tian_nm_tipoanuncio + '"' +
        '}}'
    json = json + '}';

    let convertJSON = ''; 
    convertJSON = JSON.parse(json);
    return convertJSON;
  }

  criaEstruturaJSONAgenda(model) {
    let json: string;
    json = 
    '{' +
      '"agen_sq_id": "' + model.agen_sq_id + '",' +
      '"agen_dt_inicio": "' + model.agen_dt_inicio + '",' +
      '"agen_dt_termino": "' + model.agen_dt_termino + '",' +
      '"agen_in_status": "' + model.agen_in_status + '",' +
      '"anuncio": { ' +
          '"' + model.anuncio.anun_sq_id + '": {' + 
              '"anun_sq_id": "' + model.anuncio.anun_sq_id + '",' +
              '"anun_ds_anuncio": "' + model.anuncio.anun_ds_anuncio + '"' +
          '}' +
       '}' +
    '}'

    let convertJSON = JSON.parse(json);
    return convertJSON;
  }
  
}