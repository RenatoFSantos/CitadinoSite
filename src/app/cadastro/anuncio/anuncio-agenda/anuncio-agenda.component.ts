import { CtdFuncoes } from './../../../../ctd-funcoes';
import { AnuncioService } from './../../../provider/service/anuncio.service';
import { AnuncioVO } from './../../../model/anuncioVO';
import { AgendaVO } from './../../../model/agendaVO';
import { AgendaService } from './../../../provider/service/agenda.service';
import { element } from 'protractor';
import { Subscription } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import * as firebase from 'firebase';
import * as moment from 'moment';



@Component({
  selector: 'app-anuncio-agenda',
  templateUrl: './anuncio-agenda.component.html',
  styleUrls: ['./anuncio-agenda.component.css']
})

export class AnuncioAgendaComponent implements OnInit {
  inscricao: Subscription;
  id: string = '';
  listaAgendas: Array<AgendaVO> = [];
  modo: string = 'editar';
  tituloManutencao = 'Inserir Agenda'; 

  anuncio:AnuncioVO = new AnuncioVO();
  model:AgendaVO = new AgendaVO();

  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = 'Mensagem:';
  flagHidden: boolean = true;
  intervalo: any;  
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private anuncioService: AnuncioService,
    private agendaService: AgendaService
    ) { }

  ngOnInit() {
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.id = params['id'];
        if(this.id != null) {
          this.anuncioService.getAnuncio(this.id).then((anuncio) => {
            this.anuncio = this.anuncioService.carregaObjeto(anuncio);
            // Listar todos os agendas deste anuncio
            this.carregaAgendasAnuncio(this.id);
          }),
          err => {
            console.log(err);
          }
        } else {
          this.id='';
        }
      }
    )
  }

  selecionaAgenda(chv, valor, tipo) {
    this.modo = tipo; // --- Editar ou Excluir
    switch(tipo) {
      case 'excluir':
        this.tituloManutencao = 'Excluir Agenda';
        break;
      case 'editar':
        this.tituloManutencao = 'Alterar Agenda';
        break;
      default:
        this.tituloManutencao = 'Manter Agenda';
        break;
    }

    this.model = new AgendaVO();
    this.model.agen_sq_id = chv;
    this.model.agen_dt_inicio = valor.agen_dt_inicio;
    this.model.agen_dt_termino = valor.agen_dt_termino;
    this.model.agen_in_status = valor.agen_in_status;
  }   

  carregaAgendasAnuncio(idAnuncio) {
    // Listar todos os agendas da anuncio
    let indAgenda;
    this.listaAgendas = [];
    // return new Promise((resolve) => {
        this.anuncioService.getAnuncioAgendas(idAnuncio)
        .then((snap) => {
            snap.forEach(element => {
              this.agendaService.getAgenda(element.key)
                .then(agenda => {
                  this.listaAgendas.push(agenda);            
                });
            });
          })
        // })
  }

  excluirAgenda() {
    this.anuncioService.removerAnuncioAgenda(this.anuncio, this.model)
    .then(() => {
        this.carregaAgendasAnuncio(this.anuncio.anun_sq_id);
        this.modo='editar';
        this.novoRegistro();
        // this.router.navigate([`anuncio/${this.anuncio.anun_sq_id}/agenda`]);
    }).catch(function(error) {

    });
  }

  cancelarAgenda() {
    this.modo='editar';
    this.novoRegistro();
  }

  onSubmit(form:NgForm) {
    console.log('Data de inicio do formulário=', this.model.agen_dt_inicio);
    console.log('Data de término do formulário=', this.model.agen_dt_termino);
    if(this.model.agen_dt_inicio!=undefined && this.model.agen_dt_termino!=undefined) {
      let mmDtInicio, mmDtTermino = require('moment');
      let dtInicio: Date = new Date(CtdFuncoes.convertUTCDateToLocalDate(this.model.agen_dt_inicio));
      console.log('Data de início =', dtInicio);
      let dtTermino: Date = new Date(CtdFuncoes.convertUTCDateToLocalDate(this.model.agen_dt_termino));
      console.log('Data de término =', dtTermino);
      mmDtInicio = moment(dtInicio, 'YYYY-MM-DD');
      console.log('Moment Data de início =', mmDtInicio);
      mmDtTermino = moment(dtTermino, 'YYYY-MM-DD');
      console.log('Moment Data de término =', mmDtTermino);
      if(moment(mmDtInicio).format("YYYY-MM-DD")<=moment(mmDtTermino).format("YYYY-MM-DD")) {
        console.log('Entrei no if das datas');
        if(this.model.agen_sq_id === undefined || this.model.agen_sq_id == '') {
          // *******************************************************************
          // - Rotina de Inclusão de Registro
          // *******************************************************************
          this.anuncioService.atualizarAnuncioAgenda(this.anuncio, this.model, "I")
              .then(() => {
                  this.carregaAgendasAnuncio(this.id);
                  this.novoRegistro();
              }).catch((err) => {
                this.stsMensagem = 'alert alert-dismissible alert-danger';
                this.txtMensagem = 'Erro na atualização da agenda. Verifique!';
                this.flagHidden = false;
                setTimeout(() => { this.flagHidden = true; }, 3000);                   
              });
        } else {
          console.log('Entrei no else das datas');
          // *******************************************************************
          // - Rotina de Atualização de Registro
          // *******************************************************************
          this.anuncioService.atualizarAnuncioAgenda(this.anuncio, this.model, "A")
              .then(() => {
                  this.carregaAgendasAnuncio(this.id);
                  this.novoRegistro();
              }).catch((err) => {
                this.stsMensagem = 'alert alert-dismissible alert-danger';
                this.txtMensagem = 'Erro na atualização da agenda. Verifique!';
                this.flagHidden = false;
                setTimeout(() => { this.flagHidden = true; }, 3000);                   
              });
        }    
      } else {
        console.log('Problemas com as datas');
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Data de término menor que data de início. Verifique!';
        this.flagHidden = false;
        setTimeout(() => { this.flagHidden = true; }, 3000);         
      }
    } else {
        console.log('Deveria mostrar a mensagem agora');
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Datas inválidas. Verifique!';
        this.flagHidden = false;
        setTimeout(() => { this.flagHidden = true; }, 3000);   
    }

  }

  carregaObjeto(objAnuncio):AnuncioVO {
    let objRetorno: AnuncioVO = new AnuncioVO();
    let objValor = objAnuncio.val();
    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objAnuncio.val()));

    objRetorno.anun_sq_id = objAnuncio.key;
    objRetorno.anun_ds_anuncio = objValor.anun_ds_anuncio;
    objRetorno.anun_tx_titulo = objValor.anun_tx_titulo;
    objRetorno.anun_tx_subtitulo = objValor.anun_tx_subtitulo;
    objRetorno.anun_tx_texto = objValor.anun_tx_texto;
    objRetorno.anun_tx_urlavatar = objValor.anun_tx_urlavatar;
    objRetorno.anun_tx_urlbanner = objValor.anun_tx_urlbanner;
    objRetorno.anun_tx_urlicone = objValor.anun_tx_urlicone;
    objRetorno.anun_tx_urlslide1 = objValor.anun_tx_urlslide1;
    objRetorno.anun_tx_urlslide2 = objValor.anun_tx_urlslide2;
    objRetorno.anun_tx_urlslide3 = objValor.anun_tx_urlslide3;
    objRetorno.anun_tx_urlthumbnail = objValor.anun_tx_urlthumbnail;
    objRetorno.anun_in_status = objValor.anun_in_status;
    objRetorno.anun_nr_curtidas = objValor.anun_nr_curtidas;
    objRetorno.anun_nr_salvos = objValor.anun_nr_salvos;
    objRetorno.anun_nr_visitas = objValor.anun_nr_visitas;

    return objRetorno;
  }

  novoRegistro() {
    // --- limpa objeto
    this.tituloManutencao = 'Inserir Agenda';
    this.model = new AgendaVO();
    this.model.agen_in_status='A';
  }  

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }
}
