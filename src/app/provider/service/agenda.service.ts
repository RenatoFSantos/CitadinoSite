import { AnuncioService } from './anuncio.service';
import { CtdFuncoes } from './../../../ctd-funcoes';
import { VitrineVO } from './../../model/vitrineVO';
import { AgendaVO } from './../../model/agendaVO';
import { FirebaseService } from './../database/firebase.service';
import { Injectable, Component } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class AgendaService {

  constructor(private fbSrv: FirebaseService, private anuncioService: AnuncioService) { }

  getTotalRegistros() {
    let result = 0;
    return firebase.database().ref('/agenda').orderByChild('agen_dt_inicio').once('value').then((agendas) => {
      if(agendas.val()) {
        let keys = Object.keys(agendas.val());
        result = keys.length;
      }
      return result;
    })    
  }

  getAgendas() {
    console.log('Dentro da função getAgendas()');
    return firebase.database().ref('/agenda').orderByChild('agen_dt_inicio').once('value')
    .then((agendas) => {
       console.log('Retornando as agendas');
       return agendas;
    },
    err => {
       throw 'Não existem agendas cadastradas.';
    });
  }

  getAgendasFiltro(dtIni) {
    console.log('dtIni=', dtIni);
    return firebase.database().ref('/agenda').orderByChild('agen_dt_inicio').endAt(dtIni).once('value')
    .then((agendas) => {
       console.log('Retornando as agendas filtradas');
       return agendas;
    },
    err => {
       throw 'Não existem agendas cadastradas.';
    });
  }

  getAgenda(id: string) {
    console.log('Valor do id da agenda=', id);
    return firebase.database().ref('/agenda/' + id).once('value')
      .then((agenda) => {
        console.log('Código do Anúncio do crud=', id);
        return agenda;
    },
    err => {
       throw 'Agendas não encontradas.';
    });    
  } 

  excluirAgenda(agenda: AgendaVO) {
    let result;
    let update = {};
    update[`/agenda/${agenda.agen_sq_id}`] = null;
    update[`/anuncio/${agenda.anuncio.anun_sq_id}/agenda/${agenda.agen_sq_id}`] = null;
    var objRef = firebase.database().ref(`/agenda/${agenda.agen_sq_id}`);
    result = firebase.database().ref().update(update);
    return result;
  }

  publicarAgenda(agenda: AgendaVO) {
      let objRef;
      let result;
      let update = {};
      let modelJSON = '';
      let refVitrine: string = '';
      let refMunicipio: string = '';
      let vitrine: VitrineVO = new VitrineVO();

      refVitrine = firebase.database().ref().child('vitrine').child('municipio').push().key;
      vitrine.vitr_sq_id = refVitrine;
      console.log('Novo código vitrine=', refVitrine);

      // --- Capturando o código do município
      console.log('Capturando código do município=', agenda.anuncio.municipio.muni_sq_id);
      refMunicipio = agenda.anuncio.municipio.muni_sq_id;

      // --- Ativando o anúncio - alterando o status de Inativo para Ativo
      agenda.anuncio.anun_in_status='A';
      
      // Criando o modelo JSON da Vitrine
      modelJSON = this.criaEstruturaJSON(agenda, refVitrine);
      console.log('modelJSON=', modelJSON);
      // --- Atualizando status do anúncio para Ativado.
      update[`/anuncio/${agenda.anuncio.anun_sq_id}/anun_in_status`] = 'A';
      // Atualizando dados da Anuncio na Vitrine
      update[`/vitrine/${refMunicipio}/${refVitrine}`] = modelJSON;
      // Atualizando o status da Agenda de Agendada para Publicada
      update[`/agenda/${agenda.agen_sq_id}/agen_in_status`] = 'P';
      // Atualizando a agenda com a data da última carga na vitrine
      update[`/agenda/${agenda.agen_sq_id}/agen_dt_carga`] = CtdFuncoes.convertDateToStr(new Date(), 1);

      result = firebase.database().ref().update(update);
      return result;
  }

  criaEstruturaJSON(model, idVitrine) {
    let json: string;
    json = 
    '{' +
      '"vitr_sq_id":"' + idVitrine + '",' +
      '"vitr_dt_agendada":"' + CtdFuncoes.convertDateToStr(new Date(), 1) + '",' +
      '"vitr_sq_ordem":"' + new Date().getTime() + '",' +
      '"anun_sq_id":"' + model.anuncio.anun_sq_id + '",' +
      '"anun_ds_anuncio":"' + model.anuncio.anun_ds_anuncio + '",' +
      '"anun_tx_titulo":"' + model.anuncio.anun_tx_titulo + '",' +
      '"anun_tx_subtitulo":"' + model.anuncio.anun_tx_subtitulo + '",' +
      '"anun_tx_texto":"' + model.anuncio.anun_tx_texto + '",' +
      '"anun_tx_urlavatar":"' + model.anuncio.anun_tx_urlavatar + '",' +
      '"anun_tx_urlthumbnail":"' + model.anuncio.anun_tx_urlthumbnail + '",' +
      '"anun_tx_urlbanner":"' + model.anuncio.anun_tx_urlbanner + '",' +
      '"anun_tx_urlicone":"' + model.anuncio.anun_tx_urlicone + '",' +
      '"anun_tx_urlslide1":"' + model.anuncio.anun_tx_urlslide1 + '",' +
      '"anun_tx_urlslide2":"' + model.anuncio.anun_tx_urlslide2 + '",' +
      '"anun_tx_urlslide3":"' + model.anuncio.anun_tx_urlslide3 + '",' +
      '"anun_nr_curtidas":' + model.anuncio.anun_nr_curtidas + ',' +
      '"anun_nr_salvos":' + model.anuncio.anun_nr_salvos + ',' +
      '"anun_nr_visitas":' + model.anuncio.anun_nr_visitas + ',' +
      '"anun_in_status":"' + model.anuncio.anun_in_status + '",' +
      '"anun_in_smartsite":' + model.anuncio.anun_in_smartsite + ',' +
      '"empr_sq_id":"' + model.anuncio.empresa.empr_sq_id + '",' +
      '"muni_sq_id":"' + model.anuncio.municipio.muni_sq_id + '",' +
      '"tian_sq_id":"' + model.anuncio.tipoanuncio.tian_sq_id + '",' +
      '"agen_sq_id":"' + model.agen_sq_id + '"' +
    '}'
    console.log('JSON criado da anuncio=', json);

    let convertJSON = ''; 
    convertJSON = JSON.parse(json);
    return convertJSON;
  }

  carregaObjeto(objAgenda):Promise<AgendaVO> {
    let objRetorno: AgendaVO = new AgendaVO();
    console.log('Entrei na carga da agenda');
    let objValor = objAgenda.val();
    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objAgenda.val()));
    let indAnuncio = Object.keys(obj.anuncio);
    let indEmpresa;
    let indMunicipio;
    let indTipoAnuncio;
    console.log('indAnuncio', indAnuncio);

    // --- Buscar dados do anúncio
    return new Promise((resolve) => {
      this.anuncioService.getAnuncio(indAnuncio[0])
      .then((objAnuncio) => {
        indEmpresa = Object.keys(objAnuncio.val().empresa);
        console.log('indEmpresa', indEmpresa);
        indMunicipio = Object.keys(objAnuncio.val().municipio);
        console.log('indMunicipio', indMunicipio);
        indTipoAnuncio = Object.keys(objAnuncio.val().tipoanuncio);
        console.log('indTipoAnuncio', indTipoAnuncio);
        objRetorno.agen_sq_id = objAgenda.key;
        objRetorno.agen_dt_inicio = objValor.agen_dt_inicio;
        objRetorno.agen_dt_termino = objValor.agen_dt_termino;
        objRetorno.agen_dt_carga = objValor.agen_dt_carga;
        objRetorno.agen_in_status = objValor.agen_in_status;
        objRetorno.anuncio.anun_sq_id = objAnuncio.val().anun_sq_id;
        objRetorno.anuncio.anun_ds_anuncio = objAnuncio.val().anun_ds_anuncio;
        objRetorno.anuncio.anun_tx_titulo = objAnuncio.val().anun_tx_titulo;
        objRetorno.anuncio.anun_tx_subtitulo = objAnuncio.val().anun_tx_subtitulo;
        objRetorno.anuncio.anun_tx_texto = objAnuncio.val().anun_tx_texto;
        objRetorno.anuncio.anun_tx_urlavatar = objAnuncio.val().anun_tx_urlavatar;
        objRetorno.anuncio.anun_tx_urlbanner = objAnuncio.val().anun_tx_urlbanner;
        objRetorno.anuncio.anun_tx_urlicone = objAnuncio.val().anun_tx_urlicone;
        objRetorno.anuncio.anun_tx_urlslide1 = objAnuncio.val().anun_tx_urlslide1;
        objRetorno.anuncio.anun_tx_urlslide2 = objAnuncio.val().anun_tx_urlslide2;
        objRetorno.anuncio.anun_tx_urlslide3 = objAnuncio.val().anun_tx_urlslide3;
        objRetorno.anuncio.anun_tx_urlthumbnail = objAnuncio.val().anun_tx_urlthumbnail;
        objRetorno.anuncio.anun_nr_visitas = objAnuncio.val().anun_nr_visitas;
        objRetorno.anuncio.anun_nr_salvos = objAnuncio.val().anun_nr_salvos;
        objRetorno.anuncio.anun_nr_curtidas = objAnuncio.val().anun_nr_curtidas;
        objRetorno.anuncio.anun_in_status = objAnuncio.val().anun_in_status;
        objRetorno.anuncio.anun_in_smartsite = objAnuncio.val().anun_in_smartsite;
        objRetorno.anuncio.empresa.empr_sq_id = objAnuncio.val().empresa[indEmpresa[0]].empr_sq_id;
        objRetorno.anuncio.empresa.empr_nm_razaosocial = objAnuncio.val().empresa[indEmpresa[0]].empr_nm_razaosocial;
        objRetorno.anuncio.municipio.muni_sq_id = objAnuncio.val().municipio[indMunicipio[0]].muni_sq_id;
        objRetorno.anuncio.municipio.muni_nm_municipio = objAnuncio.val().municipio[indMunicipio[0]].muni_nm_municipio;
        objRetorno.anuncio.tipoanuncio.tian_sq_id = objAnuncio.val().tipoanuncio[indTipoAnuncio[0]].tian_sq_id;
        objRetorno.anuncio.tipoanuncio.tian_nm_tipoanuncio = objAnuncio.val().tipoanuncio[indTipoAnuncio[0]].tian_nm_tipoanuncio;
        console.log('objRetorno=', objRetorno);
        resolve(objRetorno);
      })
    })
  }  
}
