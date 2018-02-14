import { EnderecoService } from './../../provider/service/endereco.service';
import { UsuarioService } from './../../provider/service/usuario.service';
import { UsuarioVO } from 'app/model/usuarioVO';
import { AuthService } from './../../auth.service';
import { LoginComponent } from './../../login/login.component';
import { ItemService } from './../../provider/service/item.service';
import { PedidoService } from './../../provider/service/pedido.service';
import { PedidoItemVO } from './../../model/pedidoItemVO';
import { Subject } from 'rxjs/Subject';
import { CategoriaPSService } from 'app/provider/service/categoria-ps.service';
import { CategoriaPSVO } from './../../model/categoriapsVO';
import { TabelaPrecoVO } from './../../model/tabelaPrecoVO';
import { NgForm, FormsModule } from '@angular/forms';
import { TabelaPrecoService } from 'app/provider/service/tabela-preco.service';
import { EmpresaVO } from './../../model/empresaVO';
import { EmpresaService } from './../../provider/service/empresa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { setTimeout } from 'timers';
import { Observable } from 'rxjs/Observable';
import { PedidoVO } from 'app/model/pedidoVO';
import { EnderecoVO } from 'app/model/enderecoVO';

declare var jQuery:any;

@Component({
  selector: 'app-pedido-produto',
  templateUrl: './pedido-produto.component.html',
  styleUrls: ['./pedido-produto.component.css']
})
export class PedidoProdutoComponent implements OnInit {

  stsMensagem: string = '';
  mensagem: string = '';
  flagHidden: boolean = true;
  txtMensagem: string = '';
  inscricao: Subscription;
  idEmpresa: string;
  idCategoria: string;
  objEmpresa: EmpresaVO;
  objTabelaPreco: TabelaPrecoVO;
  objCategoriaPS: CategoriaPSVO;
  objUsuario: UsuarioVO;
  objEndereco: EnderecoVO;
  listaItens: any = [];
  listaCategorias: any = []
  flagModo: string = 'lista'; // Visualização em modo lista
  txtFiltro: string = '';
  termosDaBusca: Subject<string> = new Subject<string>();
  objCategorias: Observable<CategoriaPSVO[]>;
  objCategoriaPSFiltro: CategoriaPSVO = new CategoriaPSVO();
  itensSelecionados: number = 0;
  objPedido: PedidoVO;
  objPedidoItem: PedidoItemVO;
  listaItensSelecionados: Array<PedidoItemVO> = [];
  listaEnderecos: Array<EnderecoVO> = [];
  listaFormaPagamento: Array<string> = [];
  user: any = '';
  formaPagto: any = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private empresaService: EmpresaService,
    private tabelaPrecoService: TabelaPrecoService,
    private categoriapsService: CategoriaPSService,
    private pedidoService: PedidoService,
    private itemService: ItemService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private enderecoService: EnderecoService
  ) { }

  ngOnInit() {
    // -- Inicializando as variáveis do pedido
    this.objPedido = new PedidoVO();
    this.listaItensSelecionados = [];
    this.idCategoria='';
    this.listaEnderecos=[];
    this.listaFormaPagamento = [
      'Dinheiro', 'Cheque', 'Cartão'
    ]
    this.formaPagto = 'Cartão'
    // -- Identificando o Usuário do Pedido
    this.objUsuario = new UsuarioVO();
    this.user = this.authService.getLoggedInUser();
    this.usuarioService.getUsuario(this.user.uid)
      .then((usu) => {
        this.objUsuario = this.usuarioService.carregaObjeto(usu);
        this.carregaEnderecosDoUsuario();
      })
      .catch((err) => {
        console.log('Problemas na carga do usuário no pedido! Erro=', err);
      });


    this.inscricao = this.route.params.subscribe(
      (params:any) => {
        this.idEmpresa = params['id'];
        console.log('Carregando empresa do produto=', this.idEmpresa);
        this.objEmpresa = new EmpresaVO();
        if (this.idEmpresa!=null) {
          this.empresaService.getEmpresa(this.idEmpresa)
            .then((empresa) => {
              console.log('Vou carregar o objeto empresa');
              this.objEmpresa = this.empresaService.carregaObjeto(empresa);
              console.log('Vou carregar os itens do cardápio');
              this.carregaItensTabelaPreco(this.objEmpresa.empr_sq_id, '', '');
            })
            .catch(err => {
              this.stsMensagem = 'alert alert-dismissible alert-danger';
              this.txtMensagem = 'Não foi possível carregar o itens da tabela de preço. Verifique!';
              this.flagHidden = false;
              setTimeout(() => { this.flagHidden = true; }, 3000);
            })
        }
      }
    )

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
      console.log('Lista de Categorias 1');
      objCategorias.forEach((element: any) => {
        this.listaCategorias.push(element)
      })
    })

  }

  carregaEnderecosDoUsuario() {
    this.listaEnderecos=[];
    // Carregando os endereços deste usuário
    this.objUsuario.endereco.forEach((endUsuario) => {
      this.objEndereco = new EnderecoVO();
      this.enderecoService.getEnderecoUsuario(this.objUsuario.usua_sq_id, endUsuario.ende_sq_id)
        .then((end) => {
          this.objEndereco = this.enderecoService.carregaObjeto(end);
          this.listaEnderecos.push(this.objEndereco);
        })
      })
    console.log('Lista de Enderecos carregada=', this.listaEnderecos);
    console.log('Usuário do Pedido=', this.objUsuario);
  }

  buscarCategoriaPorNome(term:string) {
    console.log('Buscando categoria por nome');
    this.termosDaBusca.next(term);
  }

  selecionaCategoria(chv, valor) {
    console.log('Selecionando categoria');
    this.idCategoria = chv; // --- carregado variável para seleção de produtos para a categoria em questão.
    this.objCategoriaPSFiltro = new CategoriaPSVO();
    this.objCategoriaPSFiltro.caps_sq_id = chv;
    this.objCategoriaPSFiltro.caps_nm_categoria = valor.caps_nm_categoria;
    this.carregaItensTabelaPreco(this.idEmpresa, this.idCategoria, '');
    this.txtFiltro='';
    jQuery("#modalCategoria").modal("hide");
  }  

  carregaItensTabelaPreco(refEmp, codcategoria, filtro) {
    console.log('Lendo a tabela de preços da empresa=', refEmp);
    this.listaItens=[];
    this.listaCategorias=[];
    this.tabelaPrecoService.getItens(refEmp)
      .then(itens => {
        if(itens.val()) {
          itens.forEach((childSnapshot) => {
            this.objTabelaPreco = new TabelaPrecoVO();
            this.objTabelaPreco = this.tabelaPrecoService.carregaObjeto(childSnapshot);
            console.log('Itens para seleção=', this.objTabelaPreco);
            if(codcategoria=='' || this.objTabelaPreco.categoriaps.caps_sq_id==codcategoria) {
              if(filtro=='' || (this.objTabelaPreco.tapr_nm_item.toLowerCase()).search(filtro.toLowerCase())>-1) {
                console.log('Carregando os itens');
                this.listaItens.push(this.objTabelaPreco);
                this.objCategoriaPS = new CategoriaPSVO();
                this.objCategoriaPS.caps_sq_id = this.objTabelaPreco.categoriaps.caps_sq_id;
                this.objCategoriaPS.caps_nm_categoria = this.objTabelaPreco.categoriaps.caps_nm_categoria;
                this.objCategoriaPS.caps_nm_pesquisa = this.objTabelaPreco.categoriaps.caps_nm_pesquisa;
                if(!this.pedidoService.verificaListaCategoria(this.listaCategorias, this.objCategoriaPS)) {
                  this.listaCategorias.push(this.objCategoriaPS);
                }
              }
            }
          });
          // --- Ordenando a lista de itens e categoria
          if(this.listaItens.length>1) {
            this.listaItens = this.itemService.orderBy(this.listaItens, ['tapr_nm_item'], ['asc']);
            this.listaCategorias = this.itemService.orderBy(this.listaCategorias, ['cate_nm_categoria'], ['asc']);
          }
        }
      })
      .catch(error => {
        console.log('Não consegui carregar os itens da tabela! Erro => ', error);
      })
  } 

  novoEndereco() {
    this.objEndereco = new EnderecoVO();
  }

  onSubmit(form:NgForm) {
    this.objCategoriaPSFiltro = new CategoriaPSVO();
    this.carregaItensTabelaPreco(this.idEmpresa, '', this.txtFiltro);
  }

  onSubmitEndereco(form:NgForm) { 
    console.log('Entrei no Submit');
    this.objEndereco.usuario.usua_sq_id = this.objUsuario.usua_sq_id;
    this.objEndereco.usuario.usua_nm_usuario = this.objUsuario.usua_nm_usuario;
    console.log('Entrei no submit do endereço', this.objEndereco);
    this.enderecoService.atualizarEndereco(this.objEndereco, "I")
    .then(() => {
        setTimeout(() => { 
          this.listaEnderecos.push(this.objEndereco);
          jQuery("#modalEndereco").modal("hide");
        }, 3000);
    }).catch((err) => {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Não foi possível salvar o registro. Verifique!';
        this.flagHidden = false;
        setInterval(() => { this.flagHidden = true; }, 3000);
    });
  }

  onSelectionChangeForma(forma) {
    this.formaPagto = forma;
    console.log('Forma selecionado=', forma);
  }

  onSelectionChangeEndereco(endereco) {
    this.objEndereco = endereco;
    console.log('Endereço selecionado=', endereco);
  }

  manterItem(item: TabelaPrecoVO, modo: string) {
    // (<HTMLFormElement>document.getElementById('mensagem')).value = 'Item [' + item.tapr_ds_item + ' selecionado!';
    this.mensagem = 'Item ' + item.tapr_nm_item + ' selecionado!';
    let result: boolean = false;
    this.listaItensSelecionados=this.pedidoService.atualizaItemPedido(item, this.listaItensSelecionados, modo);
    this.objPedido = this.pedidoService.atualizaPedido(this.listaItensSelecionados);
    if(modo=='mais') {
      // --- Fechando formulário Modal
      setTimeout(() => {
        jQuery("#modalSelecao").modal("hide");
      }, 2000)
    }
    console.log('Itens Atualizados=', this.listaItensSelecionados);
    console.log('Objeto Pedido atualizado=',this.objPedido);
    console.log('Total do Pedido atual=', this.objPedido.pedi_vl_total);
  }

  verCarrinho() {
    if(this.flagModo=='carrinho' || this.flagModo=='fechar' || this.flagModo=='finalizar') {
      this.flagModo='lista';
    } else {
      this.flagModo='carrinho';
    }
  }

  fecharPedido() {
    this.flagModo='fechar';
  }

  finalizarPedido() {
    this.flagModo='finalizar';
    console.log('Pedido=', this.objPedido);
    console.log('Itens Pedidos=', this.listaItensSelecionados);
    console.log('Usuario solicitante=', this.objUsuario);
    console.log('Endereço=', this.objEndereco);
  }

  salvarPedido() {
    this.pedidoService.salvarPedido(this.objPedido, this.listaItensSelecionados, this.objUsuario, this.objEndereco, this.formaPagto, this.idEmpresa)
      .then(() => {
        this.stsMensagem = 'alert alert-dismissible alert-success';
        this.txtMensagem = 'Aguarde...solicitando pedido!';
        this.flagHidden = false;
        setInterval(() => { 
          this.flagHidden = true; 
          this.flagModo = 'concluido';
        }, 3000);
      }).catch((err) => {
          this.stsMensagem = 'alert alert-dismissible alert-danger';
          this.txtMensagem = 'Não foi possível solicitar o pedido. Tente novamente mais tarde!';
          this.flagHidden = false;
          setInterval(() => { this.flagHidden = true; }, 3000);
      });    
  }

  limparCategoria() {
    console.log('limpando categoria ps');
    this.objCategoriaPSFiltro = new CategoriaPSVO();
    this.idCategoria='';
    this.carregaItensTabelaPreco(this.idEmpresa, this.idCategoria, ''); 
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  mudarNome() {
    console.log('Nome do botão=', (<HTMLFormElement>document.getElementById('btnEndereco')).value);
    (<HTMLFormElement>document.getElementById('btnEndereco')).value = 'Aguarde...';
  }
}
