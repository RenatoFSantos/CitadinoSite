import { MunicipioVO } from './../../model/municipioVO';
import { MunicipioService } from './../../provider/service/municipio.service';
import { PlanoService } from './../../provider/service/plano.service';
import { categorias_route } from './../categoria/categoria.routing.module';
import { element } from 'protractor';
import { Subscription } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { EmpresaService } from './../../provider/service/empresa.service';
import { EmpresaVO } from './../../model/empresaVO';
import { Component, OnInit, NgModule, ElementRef, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Response, Http, RequestOptions, Request, RequestMethod} from '@angular/http';

import { CategoriaService } from './../../provider/service/categoria.service';
import { CategoriaVO } from './../../model/categoriaVO';
import { PlanoVO } from './../../model/planoVO';
import * as firebase from 'firebase';
declare var jQuery:any;
@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})

export class EmpresaComponent implements OnInit {

  response: string;
  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;
  dataAtual: Date = new Date();
  dataFormatada: string = '';
  objEmpresa: any;
  inscricao: Subscription;
  inscricaoQuery: Subscription;
  inscricaoCategoria: Subscription;
  id: string = '';
  idCategoria: string ='';
  idPlano: string = '';
  idMunicipio: string = '';
  modo: string = '';
  hideLoader: boolean = false;
  listaCategorias: Array<CategoriaVO> = [];
  listaMunicipios: Array<MunicipioVO> = [];
  listaPlanos: Array<PlanoVO> = [];
  listaUploads: Array<File> = [];
  listaDiretorios: Array<string> = [];
  objCategorias: Observable<CategoriaVO[]>;
  objPlanos: Observable<PlanoVO[]>;
  objMunicipios: Observable<MunicipioVO[]>;
  termosDaBusca: Subject<string> = new Subject<string>();
  numPerc: number = 0;
  fileList: FileList;
    
  model:EmpresaVO = new EmpresaVO();
  modelOld:EmpresaVO = new EmpresaVO();
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private empresaService: EmpresaService, 
    private categoriaService: CategoriaService,
    private municipioService: MunicipioService,
    private planoService: PlanoService,
    private elementRef: ElementRef
    ) { }

  ngOnInit() {
    console.log('On Init');
    console.log('Data Formatada', this.dataFormatada);
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.id = params['id'];
        console.log('Valor do id: ' + this.id);
        if(this.id != null) {
          console.log('Entrei no if');
          this.empresaService.getEmpresa(this.id).then((empresa) => {
            console.log('Codigo Empresa: ', empresa.key);
            this.model = this.empresaService.carregaObjeto(empresa);
            console.log('Conteúdo do model de empresa=', this.model);
            // this.modelOld = this.model;
            // console.log('Model Old=', this.modelOld);
            this.modelOld.municipio.muni_sq_id = this.model.municipio.muni_sq_id;
            this.modelOld.municipio.muni_nm_municipio = this.model.municipio.muni_nm_municipio;
            this.modelOld.plano.plan_sq_id = this.model.plano.plan_sq_id;
            this.modelOld.plano.plan_nm_plano = this.model.plano.plan_nm_plano;
            this.modelOld.categoria.cate_sq_id = this.model.categoria.cate_sq_id;
            this.modelOld.categoria.cate_nm_categoria = this.model.categoria.cate_nm_categoria;
            console.log('Município anterior = ', this.modelOld.municipio.muni_sq_id);
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

    // - Formatando a data do dia
    let dia = this.dataAtual.getDate().toString();
    if (dia.length == 1) {
        dia = '0' + dia;
    }
    let mes = this.dataAtual.getMonth().toString();
    if (mes.length == 1) { 
        mes = '0' + mes;
    }
    let ano = this.dataAtual.getFullYear()
    this.dataFormatada = ano + '-' + mes + '-' + dia   

    // Listar todas as categorias
    this.categoriaService.getCategorias().then(snapshot => {
        snapshot.forEach((childSnapshot) => {
          this.listaCategorias.push(childSnapshot);
        });
    })

    // Listar todos os planos
    this.planoService.getPlanos().then(snapshot => {
      snapshot.forEach((childSnapshot) => {
        this.listaPlanos.push(childSnapshot);
      });
    })

    // Listar todos os municipios
    this.municipioService.getMunicipios().then(snapshot => {
      snapshot.forEach((childSnapshot) => {
        this.listaMunicipios.push(childSnapshot);
      });
    })
    
    // Categorias com Observables
    this.objCategorias = this.termosDaBusca
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => {        
        console.log('fez a busca ', term);
        return term ? this.categoriaService.search(term) : this.categoriaService.allCategorias();
      })
      .catch(err => {
        console.log(err);
        return Observable.of<CategoriaVO[]>([]);
      });
    
    this.objCategorias.subscribe((objCategorias) => {
          this.listaCategorias = [];
          objCategorias.forEach((element: any) => {
            this.listaCategorias.push(element)
          })          
    })

    // Planos com Observables
    this.objPlanos = this.termosDaBusca
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => {        
        return term ? this.planoService.search(term) : this.planoService.allPlanos();
      })
      .catch(err => {
        return Observable.of<PlanoVO[]>([]);
      });
    
    this.objPlanos.subscribe((objPlanos) => {
          this.listaPlanos = [];
          objPlanos.forEach((element: any) => {
            this.listaPlanos.push(element)
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

  fileChange(event, diretorio) {
    let self = this;
    this.numPerc = 0;
    this.fileList = event.target.files;
    let file: File;

    if(this.fileList.length > 0) {
        for(let i=0; i < this.fileList.length; i++) {
          file = this.fileList[i];
          this.listaUploads.push(file);
          this.listaDiretorios.push(diretorio);
          console.log('Diretorio da logomarca=', diretorio);
        }
    }
  }  

  uploadArquivos(lista: Array<File>, listaDir: Array<string>, idEmpresa):Promise<boolean> {
    let arquivo: File;
    let dir: String = '';
    let result: boolean = false;
    return new Promise((resolve) => {
      for(let i=0; i<lista.length; i++) {
        arquivo = lista[i];
        dir = listaDir[i];
        this.empresaService.uploadImagensEmpresa(arquivo, dir, idEmpresa)
        .then((nomeArquivo) => {
          if(nomeArquivo!=null) {
            dir=listaDir[i];
            // this.model.empr_tx_logomarca = nomeArquivo;
            this.empresaService.atualizarImagensEmpresa(idEmpresa, nomeArquivo, dir);
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

  selecionaCategoria(chv, valor) {
    this.idCategoria = chv;
    this.model.categoria.cate_sq_id = chv;
    this.model.categoria.cate_nm_categoria = valor.cate_nm_categoria;   
  }   

  selecionaPlano(chv, valor) {
    this.idPlano = chv;
    this.model.plano.plan_sq_id = chv;
    this.model.plano.plan_nm_plano = valor.plan_nm_plano;
    this.model.plano.plan_ds_descricao = valor.plan_ds_descricao;
    this.model.plano.plan_tp_valor = valor.plan_tp_valor;
    this.model.plano.plan_vl_plano = valor.plan_vl_plano;
    this.model.plano.plan_in_smartsite = valor.plan_in_smartsite;
    this.model.plano.plan_in_tabpreco = valor.plan_in_tabpreco;
    this.model.plano.plan_in_ecommerce = valor.plan_in_ecommerce;
  } 

  selecionaMunicipio(chv, valor) {
    this.idMunicipio = chv;
    this.model.municipio.muni_sq_id = valor.muni_sq_id;
    this.model.municipio.muni_nm_municipio = valor.muni_nm_municipio;
  } 

  buscarCategoriaPorNome(term:string) {
      this.termosDaBusca.next(term);
  }

  buscarPlanoPorNome(term:string) {
      this.termosDaBusca.next(term);
  }

  buscarMunicipioPorNome(term:string) {
    this.termosDaBusca.next(term);
  }

  onSubmit(form:NgForm) {
    if(this.id === undefined || this.id == '' || this.id == null) {
      // *******************************************************************
      // - Rotina de Inclusão de Registro
      // *******************************************************************
      console.log('Rotina de inclusão', this.model);
      this.empresaService.atualizarEmpresa(this.model, this.modelOld, "I")
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
      console.log('Rotina de atualização');
      console.log('total de descritores restantes=', this.model.descritor.length);
      this.empresaService.atualizarEmpresa(this.model, this.modelOld, "A")
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
    // Verificando se existem arquivos para serem carregados.
    if (this.listaUploads.length>0) {
      this.uploadArquivos(this.listaUploads, this.listaDiretorios, this.model.empr_sq_id)
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

    let resetForm = <HTMLFormElement>document.getElementById('formEmpresa');
    resetForm.reset();
    
    this.novoRegistro(); // abrindo um novo registro.
  }

  excluirEmpresa() {
    console.log('Entrei no excluir Usuário');
    this.empresaService.removendoEmpresa(this.model.empr_sq_id)
    .then(() => {
        this.router.navigate(['empresa/lista']);
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
    this.idCategoria='';
    this.idPlano='';
    this.idMunicipio='';
    this.listaUploads = [];
    this.model = new EmpresaVO();
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
    this.inscricaoQuery.unsubscribe();
  }
}
