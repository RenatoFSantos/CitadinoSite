import { MunicipioService } from './../../provider/service/municipio.service';
import { MunicipioVO } from './../../model/municipioVO';
import { Subject } from 'rxjs/Subject';
import { Subscription, Observable } from 'rxjs/Rx';
import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UsuarioService } from './../../provider/service/usuario.service';
import { EmpresaService } from './../../provider/service/empresa.service';
import { EmpresaVO } from './../../model/empresaVO';
import { UsuarioVO } from './../../model/usuarioVO';

declare var jQuery:any;

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})

export class UsuarioComponent implements OnInit {
  response: string;
  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;
  // dataAtual: Date = new Date();
  // dataFormatada: string = '';
  objUsuario: any;
  inscricao: Subscription;
  inscricaoQuery: Subscription;
  id: string = '';
  modo: string = '';
  hideLoader: boolean = false;
  listaUsuarios: Array<UsuarioVO> = [];
  listaEmpresas: Array<EmpresaVO> = [];
  listaMunicipios: Array<MunicipioVO> = [];
  objEmpresas: Observable<EmpresaVO[]>;
  objMunicipios: Observable<MunicipioVO[]>;
  termosDaBusca: Subject<string> = new Subject<string>();
  idUsuario: string = '';
  idMunicipio: string = '';
  listaUploads: Array<File> = [];
  numPerc: number = 0;

    
  model:UsuarioVO = new UsuarioVO();
  
  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private usuarioService: UsuarioService, 
    private municipioService: MunicipioService,
    private empresaService: EmpresaService) {
    
  }

  ngOnInit() {
    console.log('On Init');
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.id = params['id'];
        console.log('Valor do id: ' + this.id);
        if(this.id != null) {
          console.log('Entrei no if');
          this.usuarioService.getUsuario(this.id).then((usuario) => {
            this.model = this.usuarioService.carregaObjeto(usuario);
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

    this.inscricaoQuery = this.route.queryParams.subscribe(
      (queryParams: any) => {
        this.modo = queryParams['modo'];
        console.log('modo=' + this.modo);
      }
    )

    // Lista todos as empresas
    this.empresaService.getEmpresas().then(snapshot => {
        snapshot.forEach((childSnapshot) => {
          this.listaEmpresas.push(childSnapshot);
        });
    })

    // Usuarios com Observables
    this.objEmpresas = this.termosDaBusca
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => {        
        console.log('fez a busca ', term);
        return term ? this.empresaService.search(term) : this.empresaService.allEmpresas();
      })
      .catch(err => {
        console.log(err);
        return Observable.of<EmpresaVO[]>([]);
      });
    
    this.objEmpresas.subscribe((objEmpresas) => {
          this.listaEmpresas = [];
          objEmpresas.forEach((element: any) => {
            this.listaEmpresas.push(element)
          })          
    })

    // Municipios com Observables
    this.objMunicipios = this.termosDaBusca
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => {        
        return term ? this.municipioService.search(term) : this.municipioService.allMunicipios();
      })
      .catch(err => {
        console.log(err);
        return Observable.of<MunicipioVO[]>([]);
      });

    this.objMunicipios.subscribe((objMunicipios) => {
          this.listaMunicipios = [];
          objMunicipios.forEach((element: any) => {
            this.listaMunicipios.push(element);
          })          
    })   

  }

  selecionaEmpresa(chv, valor) {
    // this.idEmpresa = chv
    console.log('ID da empresa selecionada=', chv);
    console.log('Nome da empresa selecionada=', valor.empr_nm_razaosocial);
    this.model.empresa.empr_sq_id = chv;
    this.model.empresa.empr_nm_razaosocial = valor.empr_nm_razaosocial;
  }  
  
  selecionaMunicipio(chv, valor) {
    this.idMunicipio = chv;
    this.model.municipio.muni_sq_id = valor.muni_sq_id;
    this.model.municipio.muni_nm_municipio = valor.muni_nm_municipio;
  } 

  buscarEmpresaPorNome(term:string) {
      this.termosDaBusca.next(term);
  }

  buscarMunicipioPorNome(term:string) {
    this.termosDaBusca.next(term);
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

  uploadArquivos(lista: Array<File>, idUsuario):Promise<boolean> {
    let arquivo: File;
    let result: boolean = false;
    return new Promise((resolve) => {
      for(let i=0; i<lista.length; i++) {
        arquivo = lista[i];
        this.usuarioService.uploadImagem(arquivo, idUsuario)
        .then((nomeArquivo) => {
          if(nomeArquivo!=null) {
            // this.model.empr_tx_logomarca = nomeArquivo;
            this.usuarioService.atualizarImagem(idUsuario, nomeArquivo);
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
    let resetForm = <HTMLFormElement>document.getElementById('formUsuario');
    if(this.id === undefined || this.id == '' || this.id == null) {
      // *******************************************************************
      // - Rotina de Inclusão de Registro
      // *******************************************************************
      console.log('Rotina de inclusão');
      this.usuarioService.atualizarUsuario(this.model, "I")
          .then(() => {
              this.stsMensagem = 'alert alert-dismissible alert-success';
              this.txtMensagem = 'Aguarde...salvando registro!';
              this.flagHidden = false;
              this.verificaUploads();
              setInterval(() => { 
                this.flagHidden = true; 
              }, 3000);
              console.log('Carregando a função verifica uploads');
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
      console.log('Rotina de atualização');
      this.usuarioService.atualizarUsuario(this.model, "A")
          .then(() => {
              this.stsMensagem = 'alert alert-dismissible alert-success';
              this.txtMensagem = 'Aguarde...salvando registro!';
              this.flagHidden = false;
              this.verificaUploads();
              setInterval(() => { 
                this.flagHidden = true; 
              }, 3000);
              console.log('Carregando a função verifica uploads');
          }).catch((err) => {
              this.stsMensagem = 'alert alert-dismissible alert-danger';
              this.txtMensagem = 'Não foi possível atualizar o registro. Verifique!';
              this.flagHidden = false;
              setInterval(() => { this.flagHidden = true; }, 3000);
          });
    } 
  }

  verificaUploads() {
    let resetForm = <HTMLFormElement>document.getElementById('formUsuario');
    // Verificando se existem arquivos para serem carregados.
    console.log('Entrei na função para checar os uploads', this.listaUploads.length);
    if (this.listaUploads.length>0) {
      this.uploadArquivos(this.listaUploads, this.model.usua_sq_id)
        .then((flag) => {
          console.log('Retorno do flag=', flag);
          // Fecha a caixa modal
          if (flag) {
            jQuery("#modalUpload").modal("hide");
            console.log('Fechando modal');
          }
          resetForm.reset();
          this.novoRegistro(); // abrindo um novo registro.
          this.listaUploads = [];
        })
    } else {
      jQuery("#modalUpload").modal("hide");
      resetForm.reset();
      this.novoRegistro(); // abrindo um novo registro.
    }      
  }

  excluirUsuario() {
    console.log('Entrei no excluir Usuário');
    this.usuarioService.removendoUsuario(this.model.usua_sq_id)
    .then(() => {
        this.router.navigate(['usuario/lista']);
    }).catch(function(error) {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Não foi possível excluir o registro. Verifique!';
        this.flagHidden = false;
        setInterval(() => { this.flagHidden = true; }, 3000);
    });
  }

  novoRegistro() {
    // --- limpa objeto
    this.id='';
    this.model = new UsuarioVO();
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
    this.inscricaoQuery.unsubscribe();
  }
}
