import { NgForm } from '@angular/forms';
import { CategoriaPSService } from 'app/provider/service/categoria-ps.service';
import { CategoriaPSVO } from './../../../model/categoriapsVO';
import { TabelaPrecoVO } from './../../../model/tabelaPrecoVO';
import { EmpresaService } from './../../../provider/service/empresa.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../../auth.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { UsuarioService } from 'app/provider/service/usuario.service';
import { UsuarioVO } from 'app/model/usuarioVO';
import { Subscription, Subject, Observable } from 'rxjs/Rx';
import { EmpresaVO } from 'app/model/empresaVO';
import { TabelaPrecoService } from 'app/provider/service/tabela-preco.service';
declare var jQuery:any;

@Component({
  selector: 'app-tabela-preco',
  templateUrl: './tabela-preco.component.html',
  styleUrls: ['./tabela-preco.component.css']
})
export class TabelaPrecoComponent implements OnInit {

  stsMensagem: string = '';
  flagHidden: boolean = true;
  txtMensagem: string = '';
  listaItens = [];
  usuarioConectado: firebase.User;
  usuarioAtual: UsuarioVO = new UsuarioVO();
  inscricao: Subscription;
  inscricaoQuery: Subscription;
  id: any;
  objEmpresa: EmpresaVO;
  modo: string;
  subtitulo: string = 'Inserir Item';
  model: TabelaPrecoVO = new TabelaPrecoVO();
  flagModo: string = 'lista'; // Visualização em modo lista
  listaCategorias: Array<CategoriaPSVO> = [];
  objCategorias: Observable<CategoriaPSVO[]>;
  termosDaBusca: Subject<string> = new Subject<string>();
  idCategoria: string ='';
  numPerc: number = 0;
  fileList: FileList;
  listaUploads: Array<File> = [];
  listaDiretorios: Array<string> = [];    
  span = document.createElement('span');
  imagemPreview='../../../../assets/img/banner-citadino.jpg';
  perfUsu: string;
  
  constructor(
    private usuarioService: UsuarioService, 
    private authService: AuthService,
    private categoriapsService: CategoriaPSService,
    private tabelaPrecoService: TabelaPrecoService,
    private route: ActivatedRoute, 
    private router: Router, 
    private empresaService: EmpresaService, 
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    let indCategoria: any;
    // Capturando as informações da empresa através do id recebido
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.id = params['id'];
        if(this.id != null) {
          this.empresaService.getEmpresa(this.id).then((empresa) => {
            console.log('Codigo Empresa: ', empresa.key);
            this.objEmpresa = this.empresaService.carregaObjeto(empresa);
            this.carregaItensTabelaPreco(this.objEmpresa.empr_sq_id);
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
    
    this.perfUsu = '';
    this.inscricaoQuery = this.route.queryParams.subscribe(
      (queryParams: any) => {
        this.perfUsu = queryParams['perfUsu'];
      }
    )

    // Lendo dados da empresa através do usuário conectado no momento
    // let empkeys: any;
    // this.usuarioConectado = this.authService.getLoggedInUser();
    // this.usuarioService.getUsuario(this.usuarioConectado.uid)
    //   .then(user => {
    //     this.usuarioAtual = user.val();
    //     empkeys = Object.keys(this.usuarioAtual.empresa);
    //     this.nomeEmpresa = this.usuarioAtual.empresa[empkeys[0]].empr_nm_razaosocial;
    //   })
    //   .catch(error => {
    //     console.log('Usuário não encontrado: ', error.message);
    //   })

    // Categorias com Observables
   
    this.objCategorias = this.termosDaBusca
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => {        
        return term ? this.categoriapsService.search(term) : this.categoriapsService.allCategorias();
      })
      .catch(err => {
        console.log(err);
        return Observable.of<CategoriaPSVO[]>([]);
      });
    
    this.objCategorias.subscribe((objCategorias) => {
          this.listaCategorias = [];
          objCategorias.forEach((element: any) => {
            this.listaCategorias.push(element)
          })          
    })

    console.log('Modo de Visualização=', this.flagModo);
  }

  carregaItensTabelaPreco(refEmp) {
    this.listaItens=[];
    this.tabelaPrecoService.getItens(refEmp)
      .then(itens => {
        if(itens.val()) {
          itens.forEach((childSnapshot) => {
            var element = childSnapshot;
            this.listaItens.push(element);
          });
        }
      })
      .catch(error => {
        console.log('Não consegui carregar os itens da tabela! Erro => ', error);
      })
  }  


  buscarCategoriaPorNome(term:string) {
    this.termosDaBusca.next(term);
  }

  selecionaCategoria(chv, valor) {
    this.idCategoria = chv;
    this.model.categoriaps.caps_sq_id = chv;
    this.model.categoriaps.caps_nm_categoria = valor.caps_nm_categoria;   
  }  

  excluirItem() {
    this.tabelaPrecoService.removendoItem(this.model.tapr_sq_id, this.id)
    .then(() => {
        this.flagModo='lista';
        // this.router.navigate(['empresa/lista']);
    }).catch(function(error) {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Não foi possível excluir o registro. Verifique!';
        this.flagHidden = false;
        setInterval(() => { this.flagHidden = true; }, 3000);
    });
  }

  fileChange(event, diretorio) {
    let self = this;
    this.numPerc = 0;
    this.fileList = event.target.files;
    let file: File;
    this.listaUploads=[];
    this.listaDiretorios=[];

    if(this.fileList.length > 0) {
        for(let i=0; i < this.fileList.length; i++) {
          file = this.fileList[i];
          this.listaUploads.push(file);
          this.listaDiretorios.push(diretorio);

          // --- Apresentando o preview da imagem selecionada
          var reader = new FileReader();
    
          reader.onload = (function(theFile) {
            return function(e) {
              // Render thumbnail.
              // var span = document.createElement('span');
              // span.innerHTML = ['<img class="thumb" src="', e.target.result,
              //                   '" title="', encodeURI(theFile.name), '"/>'].join('');
              var x = ['<img class="thumb" src="', e.target.result, '" title="', encodeURI(theFile.name), '"/>'].join('');                                 
              document.getElementById("imgprv").innerHTML = x;
            };
          })(file);
    
          // Read in the image file as a data URL.
          reader.readAsDataURL(file);
          console.log('file=', file);
        }
    }
  }  

  onSubmit(form:NgForm) {
    if(this.model.tapr_sq_id === undefined || this.model.tapr_sq_id == '' || this.model.tapr_sq_id == null) {
      // *******************************************************************
      // - Rotina de Inclusão de Registro
      // *******************************************************************
      console.log('Rotina de inclusão');
      console.log('Código da empresa: ', this.objEmpresa.empr_sq_id);
      this.tabelaPrecoService.atualizarTabelaPreco(this.model, "I", this.objEmpresa)
          .then(() => {
              this.stsMensagem = 'alert alert-dismissible alert-success';
              this.txtMensagem = 'Aguarde...salvando registro!';
              this.flagHidden = false;
              this.carregaItensTabelaPreco(this.objEmpresa.empr_sq_id);
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
      this.tabelaPrecoService.atualizarTabelaPreco(this.model, "A", this.objEmpresa)
          .then(() => {
              this.stsMensagem = 'alert alert-dismissible alert-success';
              this.txtMensagem = 'Aguarde...salvando registro!';
              this.flagHidden = false;
              this.carregaItensTabelaPreco(this.objEmpresa.empr_sq_id);
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
      this.uploadArquivos(this.listaUploads, this.listaDiretorios, this.model.tapr_sq_id)
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

    // let resetForm = <HTMLFormElement>document.getElementById('formDetalhe');
    // resetForm.reset();
    
    this.novoCadastro(); // abrindo um novo registro.
  }

  uploadArquivos(lista: Array<File>, listaDir: Array<string>, idTabelaPreco):Promise<boolean> {
    let arquivo: File;
    let dir: String = '';
    let result: boolean = false;
    return new Promise((resolve) => {
      for(let i=0; i<lista.length; i++) {
        arquivo = lista[i];
        dir = listaDir[i];
        this.tabelaPrecoService.uploadImagensTabelaPreco(arquivo, dir, idTabelaPreco, this.id)
        .then((nomeArquivo) => {
          if(nomeArquivo!=null) {
            dir=listaDir[i];
            console.log('Atualizando nome da imagem com=', nomeArquivo);
            this.tabelaPrecoService.atualizarImagemTabelaPreco(idTabelaPreco, nomeArquivo, dir, this.id);
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

  novoCadastro() {
    let resetForm = <HTMLFormElement>document.getElementById('formDetalhe');
    resetForm.reset();    
    this.novoRegistro();
    this.subtitulo = 'Inserir Item';
    this.flagModo='detalhe'
    this.modo='inserir'
    this.listaUploads=[];
    this.listaDiretorios=[];
    var x = ['<img class="thumb" src="', this.imagemPreview, '"/>'].join('');                                 
    document.getElementById("imgprv").innerHTML = x;
  }

  cancelarManutencao() {
    this.flagModo='lista';
  }

  selecionarItem(chv, valor, tipo) {
    this.flagModo = 'detalhe';
    this.modo = tipo; // --- Editar ou Excluir
    this.model = new TabelaPrecoVO();
    switch(tipo) {
      case 'excluir':
        this.subtitulo = 'Excluir Item';
        break;
      case 'editar':
        this.subtitulo = 'Alterar Item';
        break;
      default:
        this.subtitulo = 'Manter Item';
        break;
    }

    this.tabelaPrecoService.getItem(chv, this.id)
      .then(snapshot => {
        this.model = this.tabelaPrecoService.carregaObjeto(snapshot)
        if(this.model.tapr_tx_imagem==null || this.model.tapr_tx_imagem=="") {
          var x = ['<img class="thumb" src="', this.imagemPreview, '"/>'].join('');                                 
        } else {
          var x = ['<img class="thumb" src="', this.model.tapr_tx_imagem, '"/>'].join('');                                 
        }
        document.getElementById("imgprv").innerHTML = x;        
      })
      .catch(error => {
        console.log('Não consigo carregar a tabela de preço. Erro=',error);
      })

  }

  novoRegistro() {
    // --- limpa objeto
    this.idCategoria='';
    this.model = new TabelaPrecoVO();
    this.model.tapr_tp_item = 'Produto';
    this.model.tapr_ds_unidade = 'und';
    this.model.tapr_vl_unitario = 0;
    this.model.tapr_vl_perc_desconto = 0;
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
    this.inscricaoQuery.unsubscribe();
  }
}
