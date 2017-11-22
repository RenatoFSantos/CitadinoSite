import { AnuncioService } from './anuncio.service';
import { CtdFuncoes } from './../../../ctd-funcoes';
import { VitrineVO } from './../../model/vitrineVO';
import { FirebaseService } from './../database/firebase.service';
import { Injectable, Component } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class VitrineService {
  constructor(private fbSrv: FirebaseService) { }
  
    getVitrinesPorMunicipio(idMunicipio: string) {
      return firebase.database().ref(`/vitrine/${idMunicipio}/`).orderByChild('vitr_dt_agendada').once('value')
      .then((vitrines) => {
         return vitrines;
      },
      err => {
         throw 'Não existem vitrines cadastradas.';
      });
    }

    getVitrinesFiltro(idMunicipio, dtIni) {
      return firebase.database().ref(`/vitrine/${idMunicipio}`).orderByChild('vitr_dt_agendada').equalTo(dtIni).once('value')
      .then((vitrines) => {
         return vitrines;
      },
      err => {
         throw 'Não existem vitrines cadastradas.';
      });
    }
  
    getVitrine(idMunicipio: string, idVitrine: string) {
      return firebase.database().ref(`/vitrine/${idMunicipio}/${idVitrine}`).once('value')
        .then((vitrine) => {
          return vitrine;
      },
      err => {
         throw 'Vitrines não encontradas.';
      });    
    } 
  
    excluirVitrine(vitrine: VitrineVO) {
      var objRef = firebase.database().ref(`/vitrine/${vitrine.muni_sq_id}/${vitrine.vitr_sq_id}`);
      return objRef.remove();
    }
  
    carregaObjeto(objVitrine):Promise<VitrineVO> {
      let objRetorno: VitrineVO = new VitrineVO();
      let objValor = objVitrine.val();
      return new Promise((resolve) => {
        // --- Buscar dados da vitrine
        objRetorno.vitr_sq_id = objVitrine.key;
        objRetorno.vitr_dt_agendada = objValor.vitr_dt_agendada;
        objRetorno.vitr_sq_ordem = objValor.vitr_sq_ordem;
        objRetorno.agen_sq_id = objValor.agen_sq_id;
        objRetorno.anun_ds_anuncio = objValor.anun_ds_anuncio;
        objRetorno.anun_tx_titulo = objValor.anun_tx_titulo;
        objRetorno.anun_tx_subtitulo = objValor.anun_tx_subtitulo;
        objRetorno.anun_tx_texto = objValor.anun_tx_texto;
        objRetorno.anun_tx_urlavatar = objValor.anun_tx_urlavatar;
        objRetorno.anun_tx_urlthumbnail = objValor.anun_tx_urlthumbnail;
        objRetorno.anun_tx_urlbanner = objValor.anun_tx_urlbanner;
        objRetorno.anun_tx_urlicone = objValor.anun_tx_urlicone;
        objRetorno.anun_tx_urlslide1 = objValor.anun_tx_urlslide1
        objRetorno.anun_tx_urlslide2 = objValor.anun_tx_urlslide2
        objRetorno.anun_tx_urlslide3 = objValor.anun_tx_urlslide3
        objRetorno.anun_tx_urlcupomaberto= objValor.anun_tx_urlcupomaberto
        objRetorno.anun_tx_urlcupomfechado= objValor.anun_tx_urlcupomfechado
        objRetorno.anun_nr_totalcupom = objValor.anun_nr_totalcupom;
        objRetorno.anun_nr_totalpremio = objValor.anun_nr_totalpremio;
        objRetorno.anun_nr_curtidas = objValor.anun_nr_curtidas;
        objRetorno.anun_nr_salvos = objValor.anun_nr_salvos;
        objRetorno.anun_nr_visitas = objValor.anun_nr_visitas;
        objRetorno.empr_sq_id = objValor.empr_sq_id;
        objRetorno.muni_sq_id = objValor.muni_sq_id;
        objRetorno.tian_sq_id = objValor.tian_sq_id;
        objRetorno.agen_sq_id = objValor.agen_sq_id;
        resolve(objRetorno);
      })
    }  

}
