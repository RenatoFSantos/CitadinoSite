import { CtdFuncoes } from './../../../../ctd-funcoes';
import { AgendaVO } from './../../../model/agendaVO';
import { AgendaService } from './../../../provider/service/agenda.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import * as moment from 'moment';

declare var jQuery:any;

@Component({
  selector: 'app-agenda-lista',
  templateUrl: './agenda-lista.component.html',
  styleUrls: ['./agenda-lista.component.css']
})

export class AgendaListaComponent implements OnInit {

  pagina: number = 0;
  qtdPorPagina: number = 200;
  qtdAdjacentes: number = 3;  
  objAgenda = [];
  agendas = [];
  totalAgendas = 0;
  totalRegistros: number = 0;
  cargaCompleta:boolean = false;
  inscricao: Subscription;

  listaAgendas = [];
  dtFiltro: string;
  modo: string;
  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;
  model: AgendaVO = new AgendaVO();
  intervalo: any;

  constructor(private route: ActivatedRoute, private router: Router, private agendaService: AgendaService) { 
    this.carregarListaAgendas();
  }

  carregarListaAgendas() {
    console.log('Recarregando a Lista de Agendas');
    console.log('getAgendas');
    this.agendas=[];
    this.agendaService.getAgendas()
    .then(snapshot => {
      if(snapshot.val()!=null && snapshot.val()!=undefined) {
        let objAgenda: AgendaVO;
        let obj = JSON.parse(JSON.stringify(snapshot.val()));
        let indicesCat = Object.keys(obj);
        this.totalRegistros = indicesCat.length;
        this.dtFiltro = CtdFuncoes.convertDateToStr(new Date(), 1);
        snapshot.forEach((element) => {
          objAgenda = new AgendaVO();
          objAgenda = element.val();
          if(element.child('anuncio').exists()){
            element.child('anuncio').forEach(elementAnuncio => {
              objAgenda.anuncio = elementAnuncio.val();
            });
          }
          console.log('lista agenda=', objAgenda);
          this.agendas.push(objAgenda);
        });
        this.carregarAgendas();
      } else {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Nenhum registro filtrado!';
        this.flagHidden = false;
        setTimeout(() => { this.flagHidden = true; }, 3000);        
      }
    })
  }

  carregaTotalAgendas() {
    this.agendaService.getTotalRegistros()
    .then(totreg => {
      this.totalRegistros = totreg;
    });    
  }

  ngOnInit() {
  }

  onSubmit(form:NgForm) {
    console.log('Filtro da data=', this.dtFiltro);
    let dtLimite: Date = new Date(this.dtFiltro);
    let dtTermino: Date
    this.pagina=0;
    let objAgenda: AgendaVO;
    this.agendas=[];
    this.agendaService.getAgendasFiltro(this.dtFiltro)
    .then(snapshot => {
      if(snapshot.val()!=null && snapshot.val()!=undefined) {
        let obj = JSON.parse(JSON.stringify(snapshot.val()));
        let indicesCat = Object.keys(obj);
        this.totalRegistros = indicesCat.length;  
        console.log('total registros filtrado=', this.totalRegistros);
        snapshot.forEach((element) => {
          objAgenda = new AgendaVO();
          objAgenda = element.val();
          dtTermino = new Date(objAgenda.agen_dt_termino);

          // A data de termino tem que ser superior a data limite para que seja exibida na lista
          // A data limite é a data de filtro utilizada para filtrar o registros da agenda com data inicial inferior a data de filtro.
          if(dtTermino>=dtLimite) {
            if(element.child('anuncio').exists()){
              element.child('anuncio').forEach(elementAnuncio => {
                objAgenda.anuncio = elementAnuncio.val();
              });
            }
            console.log('lista agenda=', objAgenda);
            this.agendas.push(objAgenda);
          } else {
            this.totalRegistros--;
          }
        });
        this.carregarAgendas();
      } else {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Nenhum registro filtrado!';
        this.flagHidden = false;
        setTimeout(() => { this.flagHidden = true; }, 3000);        
      }        
    })
  }

  publicarAgenda() {
    if(this.listaAgendas.length>0) {
      let loop = 0;
      this.listaAgendas.forEach(element => {
        this.agendaService.getAgenda(element.agen_sq_id)
        .then(snapAgenda => {
          this.agendaService.carregaObjeto(snapAgenda)
          .then(elementoAgenda => {
            this.model = elementoAgenda;
            loop++;
            if(loop>0) {
              // *******************************************************************
              // - Rotina de Publicação de Registro
              // *******************************************************************
              let mmDtTermino, mmDtCarga, mmDtAtual = require('moment');
              let dtTermino: Date = new Date(CtdFuncoes.convertUTCDateToLocalDate(this.model.agen_dt_termino));
              let dtCarga: Date;
              if(this.model.agen_dt_carga!=undefined) {
                // dtCarga = new Date(this.model.agen_dt_carga);
                dtCarga = new Date(CtdFuncoes.convertUTCDateToLocalDate(this.model.agen_dt_carga))
                mmDtCarga = moment(dtCarga, "YYYY-MM-DD");
              }
              let dtAtual: Date = new Date();
              // --- Transformando datas utilizando o Moment.js
              mmDtTermino = moment(dtTermino, "YYYY-MM-DD");
              mmDtAtual = moment(dtAtual, "YYYY-MM-DD");
              
              // Só publicar anúncio se a data atual for menor ou igual a data de término agendada
              // e se a data atual for maior que a data de carga, caso contrário este anúncio já foi publicado.
              if(moment(mmDtAtual).format("YYYY-MM-DD")<=moment(mmDtTermino).format("YYYY-MM-DD") && (moment(mmDtAtual).format("YYYY-MM-DD")>moment(mmDtCarga).format("YYYY-MM-DD") || dtCarga==undefined)) {
                this.agendaService.publicarAgenda(this.model)
                    .then(() => {
                        this.stsMensagem = 'alert alert-dismissible alert-success';
                        this.txtMensagem = 'Anúncio publicado!';
                        this.flagHidden = false;
                        this.intervalo = setTimeout(() => { this.recarregaAnuncios() }, 3000);
                    }).catch((err) => {
                        this.stsMensagem = 'alert alert-dismissible alert-danger';
                        this.txtMensagem = 'Não foi possível publicar o anúncio. Verifique!';
                        this.flagHidden = false;
                        this.intervalo = setTimeout(() => { this.recarregaAnuncios() }, 3000);
                      });
              } else {
                this.stsMensagem = 'alert alert-dismissible alert-success';
                this.txtMensagem = 'Os anúncios já foram publicados anteriormente.';
                this.flagHidden = false;
                this.intervalo = setTimeout(() => { this.recarregaAnuncios() }, 3000);
              }
            }
          })
          .catch(err => {
            this.stsMensagem = 'alert alert-dismissible alert-danger';
            this.txtMensagem = 'Ocorreu um erro no momento de publicar um anúncio.';
            this.flagHidden = false;          
            this.intervalo = setTimeout(() => { this.recarregaAnuncios() }, 3000);
          })
        })
      });
    } else {
      this.stsMensagem = 'alert alert-dismissible alert-danger';
      this.txtMensagem = 'Não existem anúncios para serem publicados.';
      this.flagHidden = false;          
      this.intervalo = setTimeout(() => { this.recarregaAnuncios() }, 3000);
    }
  }

  recarregaAnuncios() {
    jQuery("#modalPublicacao").modal("hide");
    this.flagHidden = true;
  }

  paginar($event: any) {
		this.pagina = $event - 1;
		this.carregarAgendas();
	}

  carregarAgendas() {
    this.listaAgendas = [];
    let cont = 0;
    console.log('Carregando agendas');
		for (let i = ( this.pagina * this.qtdPorPagina ); i < (this.pagina * this.qtdPorPagina + this.qtdPorPagina); i++) {
			if (i >= this.totalRegistros) {
				break;
			}
      this.listaAgendas.push(this.agendas[i]);
      if((this.agendas[i]).agen_sq_id==undefined) {
        cont++;
        console.log('Agenda sem id=', this.agendas[i]);
      }
    }
    console.log('Total de registros sem id=',cont);
  }
}
