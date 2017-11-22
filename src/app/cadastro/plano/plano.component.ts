import { Subscription } from 'rxjs/Rx';
import { PlanoService } from './../../provider/service/plano.service';
import { PlanoVO } from './../../model/planoVO';
import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-plano',
  templateUrl: './plano.component.html',
  styleUrls: ['./plano.component.css']
})

export class PlanoComponent implements OnInit {
  response: string;
  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;
  objPlano: any;
  inscricao: Subscription;
  inscricaoQuery: Subscription;
  id: string = '';
  modo: string = '';
  hideLoader: boolean = false;
    
  model:PlanoVO = new PlanoVO();
  
  constructor(private route: ActivatedRoute, private router: Router, private planoService: PlanoService) {
    
  }

  ngOnInit() {
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.id = params['id'];
        if(this.id != null) {
          this.planoService.getPlano(this.id).then((plano) => {
            this.model = this.carregaObjeto(plano);

          }),
          err => {
            console.log(err);
          }
        } else {
          this.id='';
        }
      }
    )

    this.inscricaoQuery = this.route.queryParams.subscribe(
      (queryParams: any) => {
        this.modo = queryParams['modo'];
      }
    )
  }

  onSubmit(form:NgForm) {
    if(this.id === undefined || this.id == '' || this.id == null) {
      // *******************************************************************
      // - Rotina de Inclusão de Registro
      // *******************************************************************
      console.log('Rotina de inclusão');
      this.planoService.atualizarPlano(this.model, "I")
          .then(() => {
              this.stsMensagem = 'alert alert-dismissible alert-success';
              this.txtMensagem = 'Aguarde...salvando registro!';
              this.flagHidden = false;
              setInterval(() => { this.flagHidden = true; }, 3000);
          }).catch((err) => {
              this.stsMensagem = 'alert alert-dismissible alert-danger';
              this.txtMensagem = 'Não foi possível salvar o registro. Verifique!';
              this.flagHidden = false;
              setInterval(() => { this.flagHidden = true; }, 3000);
          });

    } else {
      // *******************************************************************
      // - Rotina de Atualização de Registro
      // *******************************************************************
      this.planoService.atualizarPlano(this.model, "A")
          .then(() => {
              this.stsMensagem = 'alert alert-dismissible alert-success';
              this.txtMensagem = 'Aguarde...salvando registro!';
              this.flagHidden = false;
              setInterval(() => { this.flagHidden = true; }, 3000);
          }).catch((err) => {
              this.stsMensagem = 'alert alert-dismissible alert-danger';
              this.txtMensagem = 'Não foi possível atualizar o registro. Verifique!';
              this.flagHidden = false;
              setInterval(() => { this.flagHidden = true; }, 3000);
          });

    }    
    let resetForm = <HTMLFormElement>document.getElementById('formPlano');
    resetForm.reset();
    
    this.novoRegistro(); // abrindo um novo registro.
  }

  excluirPlano() {
    this.planoService.removendoPlano(this.model.plan_sq_id)
    .then(() => {
        this.router.navigate(['plano/lista']);
    }).catch(function(error) {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Não foi possível excluir o registro. Verifique!';
        this.flagHidden = false;
        setInterval(() => { this.flagHidden = true; }, 3000);
    });
  }

  carregaObjeto(objPlano): PlanoVO {
    let objRetorno: PlanoVO = new PlanoVO();
    let objValor = objPlano.val();
    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objPlano.val()));

    objRetorno.plan_sq_id= objPlano.key;
    objRetorno.plan_nm_plano= objValor.plan_nm_plano;
    objRetorno.plan_ds_descricao= objValor.plan_ds_descricao;
    objRetorno.plan_vl_plano= objValor.plan_vl_plano;
    objRetorno.plan_tp_valor= objValor.plan_tp_valor;
    objRetorno.plan_in_smartsite = objValor.plan_in_smartsite;
    objRetorno.plan_in_tabpreco = objValor.plan_in_tabpreco;
    objRetorno.plan_in_ecommerce = objValor.plan_in_ecommerce;    

    return objRetorno;
  }  

  novoRegistro() {
    // --- limpa objeto
    this.id='';
    this.model = new PlanoVO();
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
    this.inscricaoQuery.unsubscribe();
  }
}
