import { EmpresaVO } from './../../../model/empresaVO';
import { EmpresaService } from './../../../provider/service/empresa.service';
import { Subscription } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, NgModule, ElementRef, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Response, Http, RequestOptions, Request, RequestMethod} from '@angular/http';
import { SmartsiteService } from './../../../provider/service/smartsite.service';
import { SmartsiteVO } from './../../../model/smartsiteVO';

import * as firebase from 'firebase';
declare var jQuery:any;

@Component({
  selector: 'app-empresa-smartsite',
  templateUrl: './empresa-smartsite.component.html',
  styleUrls: ['./empresa-smartsite.component.css']
})

export class SmartsiteComponent implements OnInit {

  response: string;
  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;
  objSmartsite: any;
  inscricao: Subscription;
  id: string = '';
  modo: string = 'editar';
  hideLoader: boolean = false;
  listaUploads: Array<File> = [];
  numPerc: number = 0;

  model:SmartsiteVO = new SmartsiteVO();
  empresa: EmpresaVO = new EmpresaVO();
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private smartsiteService: SmartsiteService,
    private empresaService: EmpresaService
    ) { }

  ngOnInit() {
    console.log('On Init');
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.id = params['id'];
        if(this.id != null) {
          this.empresaService.getEmpresa(this.id)
            .then((empresa) => {
              this.empresa = this.empresaService.carregaObjeto(empresa);
          }),
          err => {
            console.log(err);
          }
        } else {
          this.id='';
          console.log('Estou no else com o id=' + this.id);
        }
      }
    )

    this.carregaSmartsiteEmpresa(this.id);

  }

  carregaSmartsiteEmpresa(id) {
    // Listar todos os descritores da empresa
    this.empresaService.getEmpresaSmartsite(this.id)
        .then(snap => {
          if (snap.val()!=null) {
            console.log('Valor do snap=', snap.val());
            console.log('Chave do snap=', snap.key);
            let indSmart = Object.keys(snap.val());
            this.smartsiteService.getSmartsite(indSmart[0])
              .then(smartsite => {
                this.model = this.smartsiteService.carregaObjeto(smartsite);
              })
          }
        });
  }

  fileChange(event) {
      let self = this;
      this.numPerc = 0;
      let fileList: FileList = event.target.files;
      let file: File;

      if(fileList.length > 0) {
          for(let i=0; i < fileList.length; i++) {
            file = fileList[i];
            this.listaUploads.push(file);
          }
      }
  }

  uploadArquivos(lista: Array<File>, idSmartsite):Promise<boolean> {
    let arquivo: File;
    let result: boolean = false;
    return new Promise((resolve) => {
      for(let i=0; i<lista.length; i++) {
        arquivo = lista[i];
        this.smartsiteService.uploadImagemSmartsite(arquivo, idSmartsite)
        .then((nomeArquivo) => {
          if(nomeArquivo!=null) {
            // this.model.empr_tx_logomarca = nomeArquivo;
            this.smartsiteService.atualizarNomeArquivo(idSmartsite, nomeArquivo);
          }
          console.log('Nome do arquivo de retorno: ', nomeArquivo);
          result = true;
          resolve(result);
        })
        .catch(err => {
          console.log('Erro: ', err)
          resolve(result);
        });
      }
    });
  } 

  onSubmit(form:NgForm) {
    if(this.model.smar_sq_id === undefined || this.model.smar_sq_id == '' || this.model.smar_sq_id == null) {
      // *******************************************************************
      // - Rotina de Inclusão de Registro
      // *******************************************************************
      console.log('Rotina de inclusão');
      this.smartsiteService.atualizarSmartsite(this.model, this.empresa, "I")
          .then(() => {
              this.stsMensagem = 'alert alert-dismissible alert-success';
              this.txtMensagem = 'Aguarde...salvando registro!';
              this.flagHidden = false;
          }).catch((err) => {
              this.stsMensagem = 'alert alert-dismissible alert-danger';
              this.txtMensagem = 'Não foi possível salvar o registro. Verifique!';
              this.flagHidden = false;
          });
    } else {
      // *******************************************************************
      // - Rotina de Atualização de Registro
      // *******************************************************************
      console.log('Rotina de atualização');
      this.smartsiteService.atualizarSmartsite(this.model, this.empresa, "A")
          .then(() => {
              this.stsMensagem = 'alert alert-dismissible alert-success';
              this.txtMensagem = 'Aguarde...salvando registro!';
              this.flagHidden = false;
          }).catch((err) => {
              this.stsMensagem = 'alert alert-dismissible alert-danger';
              this.txtMensagem = 'Não foi possível atualizar o registro. Verifique!';
              this.flagHidden = false;
          });
    }
    // Verificando se existem arquivos para serem carregados.
    if (this.listaUploads.length>0) {
      this.uploadArquivos(this.listaUploads, this.model.smar_sq_id)
        .then((flag) => {
          console.log('Retorno do flag=', flag);
          // Fecha a caixa modal
          if (flag) {
            jQuery("#modalUpload").modal("hide");
            console.log('Fechando modal');
          }
        })
    } else {
      jQuery("#modalUpload").modal("hide");
    }    

    // let resetForm = <HTMLFormElement>document.getElementById('formSmartsite');
    // resetForm.reset();
    
    // this.novoRegistro(); // abrindo um novo registro.
  }

  excluirSmartsite() {
    this.smartsiteService.removerSmartsite(this.model)
    .then(() => {
        this.router.navigate(['empresa/lista']);
    }).catch(function(error) {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Não foi possível excluir o registro. Verifique!';
        this.flagHidden = false;
    });
  }

  novoRegistro() {
    // --- limpa objeto
    this.id='';
    this.listaUploads = [];
    this.model = new SmartsiteVO();
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }
}
