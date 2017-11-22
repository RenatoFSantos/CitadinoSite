import { Subscription } from 'rxjs/Rx';
import { CategoriaService } from './../../provider/service/categoria.service';
import { CategoriaVO } from './../../model/categoriaVO';
import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
declare var jQuery:any;

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})

export class CategoriaComponent implements OnInit {
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

    
  model:CategoriaVO = new CategoriaVO();
  
  constructor(private route: ActivatedRoute, private router: Router, private categoriaService: CategoriaService) {
    
  }

  ngOnInit() {
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.id = params['id'];
        if(this.id != null) {
          this.categoriaService.getCategoria(this.id).then((categoria) => {
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

  fileChange(event) {
      this.listaUploads=[]; // --- Limpa a lista
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

  uploadArquivos(lista: Array<File>, id):Promise<boolean> {
    let arquivo: File;
    let result: boolean = false;
    return new Promise((resolve) => {
      for(let i=0; i<lista.length; i++) {
        arquivo = lista[i];
        this.categoriaService.uploadImagem(arquivo, id)
        .then((nomeArquivo) => {
          if(nomeArquivo!=null) {
            this.categoriaService.atualizarImagem(id, nomeArquivo);
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
    console.log('Salvando dados');
    if(this.id === undefined || this.id == '' || this.id == null) {
      // *******************************************************************
      // - Rotina de Inclusão de Registro
      // *******************************************************************
      console.log('Rotina de inclusão');
      this.categoriaService.atualizarCategoria(this.model, "I")
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
      this.categoriaService.atualizarCategoria(this.model, "A")
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
    this.intervalo = setInterval(() => {
      let resetForm = <HTMLFormElement>document.getElementById('formCategoria');    
      this.cancelaIntervalo();
      resetForm.reset();
      this.novoRegistro(); // abrindo um novo registro.      
    }, 3000);
  }

  cancelaIntervalo() {
    this.flagHidden = true;
    // Verificando se existem arquivos para serem carregados.
    console.log('Antes de testar se existem arquivos para carregar');
    if (this.listaUploads.length>0) {
      console.log('Tem arquivo para subir da categoria=', this.model.cate_sq_id);
      this.uploadArquivos(this.listaUploads, this.model.cate_sq_id)
      .then((flag) => {
        console.log('Retorno do flag=', flag);
        // Fecha a caixa modal
        if (flag) {
          jQuery("#modalUpload").modal("hide");
          console.log('Fechando modal');
          clearInterval(this.intervalo);
        }
      })
    } else {
      console.log('Não tem arquivos. Fechando modal!');
      jQuery("#modalUpload").modal("hide");
      clearInterval(this.intervalo);
    }
    // -----------------------------------------------------------------------------   
  }

  excluirCategoria() {
    this.categoriaService.removendoCategoria(this.model.cate_sq_id)
    .then(() => {
        this.router.navigate(['categoria/lista']);
    }).catch(function(error) {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Não foi possível excluir o registro. Verifique!';
        this.flagHidden = false;
        setInterval(() => { this.flagHidden = true; }, 3000);
    });
  }

  carregaObjeto(objCategoria): CategoriaVO {
    let objRetorno: CategoriaVO = new CategoriaVO();
    let objValor = objCategoria.val();
    // --- Converte objeto interno em objeto Javascript
    let obj = JSON.parse(JSON.stringify(objCategoria.val()));

    objRetorno.cate_sq_id = objCategoria.key;
    objRetorno.cate_nm_categoria = objValor.cate_nm_categoria;
    objRetorno.cate_in_tipo = objValor.cate_in_tipo;
    objRetorno.cate_tx_imagem = objValor.cate_tx_imagem;

    return objRetorno;
  }

  novoRegistro() {
    // --- limpa objeto
    this.id = '';
    this.objCategoria = new CategoriaVO();
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
    this.inscricaoQuery.unsubscribe();
  }
}
