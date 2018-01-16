import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';

import { CategoriaPSService } from 'app/provider/service/categoria-ps.service';
import { CategoriaPSVO } from './../../model/categoriapsVO';
import { setTimeout } from 'timers';


declare var jQuery:any;

@Component({
  selector: 'app-categoria-ps',
  templateUrl: './categoria-ps.component.html',
  styleUrls: ['./categoria-ps.component.css']
})
export class CategoriaPsComponent implements OnInit {
  response: string;
  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;
  objCategoria: any;
  inscricao: Subscription;
  inscricaoQuery: Subscription;
  id: string = '';
  modo: string = '';
  hideLoader: boolean = false;
  listaUploads: Array<File> = [];
  numPerc:number = 0;
  intervalo:any;

    
  model:CategoriaPSVO = new CategoriaPSVO();
  
  constructor(private route: ActivatedRoute, private router: Router, private categoriapsService: CategoriaPSService) {
    
  }

  ngOnInit() {
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.id = params['id'];
        if(this.id != null) {
          this.categoriapsService.getCategoria(this.id).then((categoria) => {
            this.model = this.carregaObjeto(categoria);
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
    console.log('Salvando dados');
    if(this.id === undefined || this.id == '' || this.id == null) {
      // *******************************************************************
      // - Rotina de Inclusão de Registro
      // *******************************************************************
      console.log('Rotina de inclusão');
      this.categoriapsService.atualizarCategoria(this.model, "I")
          .then((retorno:boolean) => {
              console.log('Incluindo registro');
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
      console.log('Rotina de alteração');
      this.categoriapsService.atualizarCategoria(this.model, "A")
          .then((retorno:boolean) => {
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
    console.log('Entrando no intervalo...');
    setTimeout(() => {
      console.log('Estou no Timeout da CategoriaPS');
      let resetForm = <HTMLFormElement>document.getElementById('formCategoria');
      this.flagHidden = true; 
      jQuery("#modalUpload").modal("hide");
      resetForm.reset();
      this.novoRegistro(); // abrindo um novo registro.      
    }, 3000);
  }

  excluirCategoria() {
    this.categoriapsService.removendoCategoria(this.model.caps_sq_id)
    .then(() => {
        this.router.navigate(['categoriaps/lista']);
    }).catch(function(error) {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Não foi possível excluir o registro. Verifique!';
        this.flagHidden = false;
        setInterval(() => { this.flagHidden = true; }, 3000);
    });
  }

  carregaObjeto(objCategoria): CategoriaPSVO {
    let objRetorno: CategoriaPSVO = new CategoriaPSVO();
    let objValor = objCategoria.val();
    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objCategoria.val()));

    objRetorno.caps_sq_id = objCategoria.key;
    objRetorno.caps_nm_categoria = objValor.caps_nm_categoria;

    return objRetorno;
  }

  novoRegistro() {
    // --- limpa objeto
    this.id = '';
    this.objCategoria = new CategoriaPSVO();
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
    this.inscricaoQuery.unsubscribe();
  }


}
