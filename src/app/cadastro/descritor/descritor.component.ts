import { Subscription } from 'rxjs/Rx';
import { DescritorService } from './../../provider/service/descritor.service';
import { DescritorVO } from './../../model/descritorVO';
import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-descritor',
  templateUrl: './descritor.component.html',
  styleUrls: ['./descritor.component.css']
})

export class DescritorComponent implements OnInit {
  response: string;
  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;
  objDescritor: any;
  inscricao: Subscription;
  inscricaoQuery: Subscription;
  id: string = '';
  modo: string = '';
  hideLoader: boolean = false;
  intervalo: any;
    
  model:DescritorVO = new DescritorVO();
  
  constructor(private route: ActivatedRoute, private router: Router, private descritorService: DescritorService) {
    
  }

  ngOnInit() {
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.id = params['id'];
        if(this.id != null) {
          this.descritorService.getDescritor(this.id).then((descritor) => {
            this.model = this.carregaObjeto(descritor);
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
      this.descritorService.atualizarDescritor(this.model, "I")
          .then(() => {
              this.stsMensagem = 'alert alert-dismissible alert-success';
              this.txtMensagem = 'Aguarde...salvando registro!';
              this.flagHidden = false;
              this.msgSubmit();
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
      this.descritorService.atualizarDescritor(this.model, "A")
          .then(() => {
            this.stsMensagem = 'alert alert-dismissible alert-success';
            this.txtMensagem = 'Aguarde...salvando registro!';
            this.flagHidden = false;
            this.msgSubmit();
          }).catch((err) => {
              this.stsMensagem = 'alert alert-dismissible alert-danger';
              this.txtMensagem = 'Não foi possível atualizar o registro. Verifique!';
              this.flagHidden = false;
              setInterval(() => { this.flagHidden = true; }, 3000);
          });

    }    
  }

  msgSubmit() {
    this.intervalo = setInterval(() => {
      this.cancelaIntervalo();
      let resetForm = <HTMLFormElement>document.getElementById('formDescritor');
      resetForm.reset();
      this.novoRegistro(); // abrindo um novo registro.      
    }, 3000);
  }

  cancelaIntervalo() {
    this.flagHidden = true;
    clearInterval(this.intervalo);
  }

  excluirDescritor() {
    this.descritorService.removendoDescritor(this.model.desc_sq_id)
    .then(() => {
        this.router.navigate(['descritor/lista']);
    }).catch(function(error) {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Não foi possível excluir o registro. Verifique!';
        this.flagHidden = false;
        setInterval(() => { this.flagHidden = true; }, 3000);
    });
  }

  carregaObjeto(objDescritor): DescritorVO {
    let objRetorno: DescritorVO = new DescritorVO();
    let objValor = objDescritor.val();
    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objDescritor.val()));

    objRetorno.desc_sq_id = objDescritor.key;
    objRetorno.desc_nm_descritor = objValor.desc_nm_descritor;
    objRetorno.desc_in_privado = objValor.desc_in_privado;
    console.log('Valor do privado=', objValor.desc_in_privado);

    return objRetorno;
  }

  novoRegistro() {
    // --- limpa objeto
    this.id = '';
    this.objDescritor = new DescritorVO();
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
    this.inscricaoQuery.unsubscribe();
  }
}
