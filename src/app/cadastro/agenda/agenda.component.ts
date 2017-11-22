import { CtdFuncoes } from './../../../ctd-funcoes';
import { NgForm } from '@angular/forms';
import { AgendaVO } from './../../model/agendaVO';
import { Subscription } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { AgendaService } from './../../provider/service/agenda.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {

  inscricao: Subscription;
  inscricaoQuery: Subscription;
  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;  
  id: string = '';
  modo: string = '';
  model: AgendaVO = new AgendaVO();

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private agendaService: AgendaService    
  ) { }

  ngOnInit() {
  this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.id = params['id'];
        if(this.id != null) {
          this.agendaService.getAgenda(this.id)
            .then((agenda) => {
              console.log('Codigo da Agenda: ', agenda.key);
              this.agendaService.carregaObjeto(agenda)
              .then(refAgenda => {
                console.log('Agenda retornada=', refAgenda);
                this.model=refAgenda;
                // --- RETIRADO - Liberando a exclusão de anúncios já publicados
                // if(this.model.agen_in_status=='P' && this.modo=='excluir') {
                //   this.stsMensagem = 'alert alert-dismissible alert-danger';
                //   this.txtMensagem = 'Não é possível excluir esta agenda, pois o anúncio agendado já foi publicado!';
                //   this.flagHidden = false;                  
                // }
              });
              console.log('Depois do promisse');
          }),
          err => {
            console.log(err);
          }
        } else {
          this.id='';
          console.log('Estou no else com o id=' + this.id);
        }
        console.log('Saiu das promises');
      }
    )

    this.inscricaoQuery = this.route.queryParams.subscribe(
      (queryParams: any) => {
        this.modo = queryParams['modo'];
        console.log('modo=' + this.modo);
      }
    )
    
  }

  onSubmit(form:NgForm) {
    // *******************************************************************
    // - Rotina de Publicação de Registro
    // *******************************************************************
    console.log('Rotina de inclusão', this.model);
    let dtTermino: Date = new Date(this.model.agen_dt_termino);
    let dtCarga: Date;
    if(this.model.agen_dt_carga!=null) {
      // dtCarga = new Date(this.model.agen_dt_carga);
      dtCarga =new Date(CtdFuncoes.convertUTCDateToLocalDate(this.model.agen_dt_carga))
    }    
    let dtAtual: Date = new Date();
    // Só publicar anúncio se a data atual for menor ou igual a data de término agendada
    // e se a data atual for maior que a data de carga, caso contrário este anúncio já foi publicado.
    if(dtAtual<=dtTermino || dtAtual>dtCarga) {
      this.agendaService.publicarAgenda(this.model)
          .then(() => {
              this.stsMensagem = 'alert alert-dismissible alert-success';
              this.txtMensagem = 'Anúncio publicado!';
              this.flagHidden = false;
          }).catch((err) => {
              this.stsMensagem = 'alert alert-dismissible alert-danger';
              this.txtMensagem = 'Não foi possível publicar o anúncio. Verifique!';
              this.flagHidden = false;
          });
    } else {
      this.stsMensagem = 'alert alert-dismissible alert-danger';
      this.txtMensagem = 'Anúncio fora do período de publicação. Verifique!';
      this.flagHidden = false;
    }
  }
  
  excluirAgenda() {
    console.log('Código da Agenda para exclusão=', this.model.agen_sq_id);
    // *******************************************************************
    // - Rotina de Exclusão de Registro
    // *******************************************************************
    this.agendaService.excluirAgenda(this.model)
        .then(() => {
            this.stsMensagem = 'alert alert-dismissible alert-success';
            this.txtMensagem = 'Agenda excluída com sucesso!';
            this.flagHidden = false;
        }).catch((err) => {
            this.stsMensagem = 'alert alert-dismissible alert-danger';
            this.txtMensagem = 'Não foi possível excluir esta agenda. Verifique!';
            this.flagHidden = false;
        });    
  }

}
