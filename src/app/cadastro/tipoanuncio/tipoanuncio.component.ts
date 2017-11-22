import { TipoAnuncioVO } from './../../model/tipoAnuncioVO';
import { Subscription } from 'rxjs/Rx';
import { TipoAnuncioService } from './../../provider/service/tipoanuncio.service';
import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tipoanuncio',
  templateUrl: './tipoanuncio.component.html',
  styleUrls: ['./tipoanuncio.component.css']
})

export class TipoAnuncioComponent implements OnInit {
  response: string;
  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;
  objTipoAnuncio: any;
  inscricao: Subscription;
  inscricaoQuery: Subscription;
  id: string = '';
  modo: string = '';
  hideLoader: boolean = false;
    
  model:TipoAnuncioVO = new TipoAnuncioVO();
  
  constructor(private route: ActivatedRoute, private router: Router, private tipoanuncioService: TipoAnuncioService) {
    
  }

  ngOnInit() {
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.id = params['id'];
        if(this.id != null) {
          this.tipoanuncioService.getTipoAnuncio(this.id).then((tipoanuncio) => {
            this.model = this.carregaObjeto(tipoanuncio);

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
    let resetForm = <HTMLFormElement>document.getElementById('formTipoAnuncio');
    if(this.id === undefined || this.id == '' || this.id == null) {
      // *******************************************************************
      // - Rotina de Inclusão de Registro
      // *******************************************************************
      console.log('Rotina de inclusão');
      this.tipoanuncioService.atualizarTipoAnuncio(this.model, "I")
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
      this.tipoanuncioService.atualizarTipoAnuncio(this.model, "A")
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
    resetForm.reset();
    
    this.novoRegistro(); // abrindo um novo registro.
  }

  excluirTipoAnuncio() {
    this.tipoanuncioService.removendoTipoAnuncio(this.model.tian_sq_id)
    .then(() => {
        this.router.navigate(['tipoanuncio/lista']);
    }).catch(function(error) {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Não foi possível excluir o registro. Verifique!';
        this.flagHidden = false;
        setInterval(() => { this.flagHidden = true; }, 3000);
    });
  }

  carregaObjeto(objTipoAnuncio): TipoAnuncioVO {
    let objRetorno: TipoAnuncioVO = new TipoAnuncioVO();
    let objValor = objTipoAnuncio.val();
    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objTipoAnuncio.val()));

    objRetorno.tian_sq_id= objTipoAnuncio.key;
    objRetorno.tian_nm_tipoanuncio= objValor.tian_nm_tipoanuncio;
    objRetorno.tian_nr_creditos= objValor.tian_nr_creditos;
    objRetorno.tian_nr_dias= objValor.tian_nr_dias;
    objRetorno.tian_in_tipo= objValor.tian_in_tipo;

    return objRetorno;
  }  

  novoRegistro() {
    // --- limpa objeto
    this.id='';
    this.model = new TipoAnuncioVO();
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
    this.inscricaoQuery.unsubscribe();
  }
}
