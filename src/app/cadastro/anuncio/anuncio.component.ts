import { element } from 'protractor';
import { Subscription } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, NgModule, ElementRef, ViewChild } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Response, Http, RequestOptions, Request, RequestMethod} from '@angular/http';

import { AnuncioVO } from './../../model/anuncioVO';
import { EmpresaVO } from './../../model/empresaVO';
import { MunicipioVO } from './../../model/municipioVO';
import { TipoAnuncioVO } from './../../model/tipoAnuncioVO';
import { AnuncioService } from './../../provider/service/anuncio.service';
import { TipoAnuncioService } from './../../provider/service/tipoanuncio.service';
import { MunicipioService } from './../../provider/service/municipio.service';
import { EmpresaService } from './../../provider/service/empresa.service';
import * as firebase from 'firebase';

declare var jQuery:any;

@Component({
  selector: 'app-anuncio',
  templateUrl: './anuncio.component.html',
  styleUrls: ['./anuncio.component.css']
})

export class AnuncioComponent implements OnInit {

  response: string;
  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;
  objAnuncio: any;
  inscricao: Subscription;
  inscricaoQuery: Subscription;
  id: string = '';
  idEmpresa: string ='';
  idMunicipio: string = '';
  idTipoAnuncio: string = '';
  modo: string = '';
  listaEmpresas: Array<EmpresaVO> = [];
  listaMunicipios: Array<MunicipioVO> = [];
  listaTipoAnuncios: Array<TipoAnuncioVO> = [];
  listaUploads: Array<File> = [];
  listaDiretorios: Array<string> = [];
  objEmpresas: Observable<EmpresaVO[]>;
  objMunicipios: Observable<MunicipioVO[]>;
  objTipoAnuncios: Observable<TipoAnuncioVO[]>;
  termosDaBuscaEmpresa: Subject<string> = new Subject<string>();
  termosDaBuscaMunicipio: Subject<string> = new Subject<string>();
  termosDaBuscaTipoAnuncio: Subject<string> = new Subject<string>();
  numPerc: number = 0;
  tipoanuncio: string = 'tipo-1';
  fileList: FileList;
  intervalo: any;
    
  model:AnuncioVO = new AnuncioVO();
  modelOld:AnuncioVO = new AnuncioVO();
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private anuncioService: AnuncioService, 
    private empresaService: EmpresaService,
    private municipioService: MunicipioService,
    private tipoanuncioService: TipoAnuncioService,
    private elementRef: ElementRef
    ) { }

  ngOnInit() {
    console.log('On Init');
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.id = params['id'];
        if(this.id != null) {
          console.log('Entrei nas promises');
          this.anuncioService.getAnuncio(this.id)
            .then((anuncio) => {
                // --- Retirei o bloqueio do anúncio
                // if(anuncio.child('agenda').exists()) {
                //   console.log('Tem agenda');
                //   this.bloqueiaAcesso();
                // }
                this.model = this.anuncioService.carregaObjeto(anuncio);
          }),
          err => {
            console.log(err);
          }
          // this.carregaAnuncio(this.id)
          //   .then(() => {});
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

    // Listar todas as empresas
    this.empresaService.getEmpresas().then(snapshot => {
        snapshot.forEach((childSnapshot) => {
          this.listaEmpresas.push(childSnapshot);
        });
    })

    // Listar todos os municipios
    this.municipioService.getMunicipios().then(snapshot => {
      snapshot.forEach((childSnapshot) => {
        this.listaMunicipios.push(childSnapshot);
      });
    })
    
    // Listar todos os tipos de anúncios
    this.tipoanuncioService.getTipoAnuncios().then(snapshot => {
      snapshot.forEach((childSnapshot) => {
        this.listaTipoAnuncios.push(childSnapshot);
      });
    })

    // Empresas com Observables
    this.objEmpresas = this.termosDaBuscaEmpresa
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => {        
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

    // Municipio com Observables
    this.objMunicipios = this.termosDaBuscaMunicipio
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => {        
        return term ? this.municipioService.search(term) : this.municipioService.allMunicipios();
      })
      .catch(err => {
        return Observable.of<MunicipioVO[]>([]);
      });
    
    this.objMunicipios.subscribe((objMunicipios) => {
          this.listaMunicipios = [];
          objMunicipios.forEach((element: any) => {
            this.listaMunicipios.push(element)
          })          
    })

    // Tipos de Anúncio com Observables
    this.objTipoAnuncios = this.termosDaBuscaTipoAnuncio
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => {        
        return term ? this.tipoanuncioService.search(term) : this.tipoanuncioService.allTipoAnuncios();
      })
      .catch(err => {
        return Observable.of<TipoAnuncioVO[]>([]);
      });
    
    this.objTipoAnuncios.subscribe((objTipoAnuncios) => {
          this.listaTipoAnuncios = [];
          objTipoAnuncios.forEach((element: any) => {
            this.listaTipoAnuncios.push(element)
          })          
    })

  }

  bloqueiaAcesso() {
    // --- Anúncio já foi agendado e portanto não poderá ser editado.
    console.log('Este anúncio não pode ser editado!');
    this.stsMensagem = 'alert alert-dismissible alert-danger';
    this.txtMensagem = 'Este anúncio não pode ser editado por já ter sido agendado.';
    this.flagHidden = false;
    this.intervalo = setInterval(() => {
      console.log('Estou dentro do intervalo');
      this.anuncioAgendado();
      this.router.navigate(['anuncio/lista']);
    }, 5000)
  }

  anuncioAgendado() {
    console.log('anuncioAgendado');
    this.flagHidden = true;
    clearInterval(this.intervalo);
  }

  carregaAnuncio(cod: string):Promise<boolean> {
    console.log('CARREGANDO ANUNCIO');
    return new Promise((resolve) => {
      let objAnuncio: AnuncioVO = new AnuncioVO();
      this.anuncioService.getAnuncio(cod)
        .then((anuncioref) => {
          anuncioref.forEach((element) => {
          objAnuncio = element.val();
          console.log('Carga do objeto anuncio=', objAnuncio);
          if(element.child('empresa').exists()) {
            element.child('empresa').forEach((elementEmpresa) => {
              console.log('Elemento Empresa=', elementEmpresa.val());
              objAnuncio.empresa = elementEmpresa.val();
            });
          }
          if(element.child('municipio').exists()) {
            element.child('municipio').forEach((elementMunicipio) => {
              console.log('Elemento Município=', elementMunicipio.val());
              objAnuncio.municipio = elementMunicipio.val();
            });
          }
          if(element.child('tipoanuncio').exists()) {
            element.child('tipoanuncio').forEach((elementTipoAnuncio) => {
              console.log('Elemento Tipo Anúncio=', elementTipoAnuncio.val());
              objAnuncio.tipoanuncio = elementTipoAnuncio.val();
            });
          }
          console.log('Objeto Carregado=', objAnuncio);
          //this.model = this.anuncioService.carregaObjeto(objAnuncio);
          })
          this.model = objAnuncio;
          console.log('Resultado model=', this.model);
          resolve(true);  
        },
        err => {
          console.log(err);
        });
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
            console.log('Carreguei o arquivo=', file);
            this.listaDiretorios.push(diretorio);
            console.log('Carreguei o diretorio=', diretorio);
          }
      }
  }

  uploadArquivos(lista: Array<File>, listaDir: Array<string>, idAnuncio):Promise<boolean> {
    console.log('lista de arquivos para upload=', lista);
    console.log('lista de diretorios', listaDir);
    let arquivo: File;
    let dir: string = '';
    let result: boolean = false;
    return new Promise((resolve) => {
      for(let i=0; i<lista.length; i++) {
        arquivo = lista[i];
        dir = listaDir[i];
        console.log('Upload do arquivo: ', i);
        this.anuncioService.uploadImagemAnuncio(arquivo, dir, idAnuncio)
        .then((nomeArquivo) => {
          console.log('Retorno do upload: ', i);
          dir = listaDir[i];
          if(nomeArquivo!=null) {
            console.log('Atualiando nome do arquivo', nomeArquivo);
            this.anuncioService.atualizarNomeArquivo(idAnuncio, nomeArquivo, dir);
          }
          console.log('Nome do arquivo de retorno: ', nomeArquivo);
          result = true;
          resolve(result);
        })
        .catch(err => {
          console.log('Erro: ', err)
          result = false;
          resolve(result);
        });
      }
    });
  }

  selecionaEmpresa(chv, valor) {
    this.idEmpresa = chv;
    this.model.empresa.empr_sq_id = chv;
    this.model.empresa.empr_nm_razaosocial = valor.empr_nm_razaosocial;
    this.empresaService.getEmpresaSmartsite(chv)
      .then(res => {
        if(res.val()!=null) {
          let ind = Object.keys(res.val());
          this.model.anun_in_smartsite = true;
          console.log('Tem smartsite?', Object.keys(res.val()));
        } else {
          console.log('Não tem smartsite?', res.val());
          this.model.anun_in_smartsite = false;
        }
      })
  }

  selecionaMunicipio(chv, valor) {
    this.idMunicipio = chv;
    this.model.municipio.muni_sq_id = chv;
    this.model.municipio.muni_nm_municipio = valor.muni_nm_municipio;   
  }   

  selecionaTipoAnuncio(chv, valor) {
    this.idTipoAnuncio = chv;
    this.model.tipoanuncio.tian_sq_id = chv;
    console.log('Chave do tipo de anúncio=',chv);
    this.model.tipoanuncio.tian_nm_tipoanuncio = valor.tian_nm_tipoanuncio;
  }   

  buscarEmpresaPorNome(term:string) {
    this.termosDaBuscaEmpresa.next(term);
  }

  buscarMunicipioPorNome(term:string) {
      this.termosDaBuscaMunicipio.next(term);
  }

  buscarTipoAnuncioPorNome(term:string) {
      this.termosDaBuscaTipoAnuncio.next(term);
  }

  onSubmit(form:NgForm) {
    let resetForm = <HTMLFormElement>document.getElementById('formAnuncio');
    if(this.id === undefined || this.id == '' || this.id == null) {
      // *******************************************************************
      // - Rotina de Inclusão de Registro
      // *******************************************************************
      console.log('Rotina de inclusão', this.model);
      this.anuncioService.atualizarAnuncio(this.model, this.modelOld, "I")
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
      this.anuncioService.atualizarAnuncio(this.model, this.modelOld, "A")
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
      this.uploadArquivos(this.listaUploads, this.listaDiretorios, this.model.anun_sq_id)
        .then((flag) => {
          console.log('Retorno do flag=', flag);
          // Fecha a caixa modal
          if (flag) {
            jQuery("#modalUpload").modal("hide");
            console.log('Fechando modal');
          }
          resetForm.reset();
          this.novoRegistro(); // abrindo um novo registro.
        })
    } else {
      jQuery("#modalUpload").modal("hide");
      resetForm.reset();
      this.novoRegistro(); // abrindo um novo registro.
    }    
  }

  excluirAnuncio() {
    if(this.model.anun_in_status=='I') {
      this.anuncioService.removendoAnuncio(this.model)
      .then(() => {
          this.router.navigate(['anuncio/lista']);
      }).catch(function(error) {
          this.stsMensagem = 'alert alert-dismissible alert-danger';
          this.txtMensagem = 'Problemas na exclusão do registro! Verifique!';
          this.flagHidden = false;
          setInterval(() => { this.flagHidden = true; }, 3000);
      });
    } else {
      console.log('Entrei na exclusão inválida de anúncio');
      this.stsMensagem = 'alert alert-dismissible alert-danger';
      this.txtMensagem = 'Este anúncio já foi publicado! Exclusão cancelada!';
      this.flagHidden = false;
      setInterval(() => { this.flagHidden = true; }, 3000);
    }
  }

  novoRegistro() {
    // --- limpa objeto
    this.id='';
    this.idEmpresa='';
    this.idMunicipio='';
    this.idTipoAnuncio='';
    this.listaUploads = [];
    this.model = new AnuncioVO();
    this.model.anun_in_status='I';
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
    this.inscricaoQuery.unsubscribe();
  }
}
