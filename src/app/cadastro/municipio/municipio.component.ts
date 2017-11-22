import { Subscription } from 'rxjs/Rx';
import { MunicipioService } from './../../provider/service/municipio.service';
import { MunicipioVO } from './../../model/municipioVO';
import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
declare var jQuery:any;

@Component({
  selector: 'app-municipio',
  templateUrl: './municipio.component.html',
  styleUrls: ['./municipio.component.css']
})

export class MunicipioComponent implements OnInit {
  response: string;
  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;
  objMunicipio: any;
  inscricao: Subscription;
  inscricaoQuery: Subscription;
  id: string = '';
  modo: string = '';
  hideLoader: boolean = false;
  listaUploads: Array<File> = [];
  numPerc:number = 0;

    
  model:MunicipioVO = new MunicipioVO();
  
  constructor(private route: ActivatedRoute, private router: Router, private municipioService: MunicipioService) {
    
  }

  ngOnInit() {
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.id = params['id'];
        if(this.id != null) {
          this.municipioService.getMunicipio(this.id).then((municipio) => {
            this.model = this.carregaObjeto(municipio);
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
    let resetForm = <HTMLFormElement>document.getElementById('formMunicipio');
    if(this.id === undefined || this.id == '' || this.id == null) {
      // *******************************************************************
      // - Rotina de Inclusão de Registro
      // *******************************************************************
      this.municipioService.atualizarMunicipio(this.model, "I")
          .then(() => {
    
              this.novoRegistro(); // abrindo um novo registro.
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
      this.municipioService.atualizarMunicipio(this.model, "A")
          .then(() => {
              this.novoRegistro(); // abrindo um novo registro.
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
  }

  excluirMunicipio() {
    this.municipioService.removendoMunicipio(this.model.muni_sq_id)
    .then(() => {
        this.router.navigate(['municipio/lista']);
    }).catch(function(error) {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Não foi possível excluir o registro. Verifique!';
        this.flagHidden = false;
        setInterval(() => { this.flagHidden = true; }, 3000);
    });
  }

  carregaObjeto(objMunicipio): MunicipioVO {
    let objRetorno: MunicipioVO = new MunicipioVO();
    let objValor = objMunicipio.val();
    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objMunicipio.val()));

    objRetorno.muni_sq_id = objMunicipio.key;
    objRetorno.muni_nm_municipio = objValor.muni_nm_municipio;

    return objRetorno;
  }

  novoRegistro() {
    // --- limpa objeto
    this.id = '';
    this.objMunicipio = new MunicipioVO();
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
    this.inscricaoQuery.unsubscribe();
  }
}
