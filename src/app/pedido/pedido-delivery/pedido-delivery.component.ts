import { MensagemVO } from './../../model/mensagemVO';
import { PedidoItemVO } from './../../model/pedidoItemVO';
import { ItemService } from './../../provider/service/item.service';
import { PedidoItemTotalVO } from './../../model/pedidoItemTotalVO';
import { CtdFuncoes } from './../../../ctd-funcoes';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { EmpresaService } from './../../provider/service/empresa.service';
import { EmpresaVO } from './../../model/empresaVO';
import { forEach } from '@angular/router/src/utils/collection';
import { PedidoVO } from 'app/model/pedidoVO';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs/Rx';
import { PedidoService } from './../../provider/service/pedido.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import lodash from 'lodash';

@Component({
  selector: 'app-pedido-delivery',
  templateUrl: './pedido-delivery.component.html',
  styleUrls: ['./pedido-delivery.component.css']
})
export class PedidoDeliveryComponent implements OnInit {

  stsMensagem: string = '';
  mensagem: string = '';
  flagHidden: boolean = true;
  txtMensagem: string = '';
  inscricao: Subscription;
  idEmpresa: string;
  idCategoria: string;
  flagModo: string = 'lista'; // Visualização em modo lista
  txtFiltro: string = '';
  termosDaBusca: Subject<string> = new Subject<string>();
  listaPedidos: Array<PedidoVO> = [];
  objEmpresa: EmpresaVO;
  objPedido: PedidoVO;
  corStatusPedido: string = '';
  pedidoAtual: string = '';
  dataAtual: Date = new Date();
  flagProdutos: boolean = false;
  // listaProdutos: Array<PedidoItemTotalVO>;
  listaProdutos: any;
  mensagemCliente: string;
  refreshPedido: any;

  // Parametros para filtro
  dtInicio: string;
  chk_P: boolean = true;
  chk_A: boolean = true;
  chk_F: boolean = true;
  chk_E: boolean = true;
  chk_C: boolean = true;
  chk_R: boolean = true;
  chk_X: boolean = true;


  constructor(
    private route: ActivatedRoute, 
    private router: Router,    
    private pedidoService: PedidoService,
    private empresaService: EmpresaService,
    private ctdFuncoes: CtdFuncoes,
    private itemService: ItemService
  ) {}

  ngOnInit() {
    this.dtInicio = this.dataAtual.getFullYear() + '-' + this.ctdFuncoes.leftPad(((this.dataAtual.getMonth())+1), 2, 0) + '-' + this.ctdFuncoes.leftPad(this.dataAtual.getDate(), 2, 0);
    this.objEmpresa = new EmpresaVO();
    this.inscricao = this.route.params.subscribe(
      (params:any) => {
        this.idEmpresa = params['id'];
        if (this.idEmpresa!=null) {
          this.empresaService.getEmpresa(this.idEmpresa)
            .then((empresa) => {
              this.objEmpresa=empresa.val();
              this.carregaPedidosEmpresa(this.objEmpresa.empr_sq_id, this.dtInicio);
              this.refreshPedido = setInterval(() => {
                console.log('Executando o intervalo');
                this.carregaPedidosEmpresa(this.objEmpresa.empr_sq_id, this.dtInicio);
              }, 60000);
            })
            .catch((err) => {
              this.stsMensagem = 'alert alert-dismissible alert-danger';
              this.txtMensagem = err.message;
              this.flagHidden = false;
              setTimeout(() => { this.flagHidden = true; }, 3000);      
            });
        }
      }
    )
  }

  onSubmitPedido(form: NgForm) {
    this.carregaPedidosEmpresaNome(this.txtFiltro.toLowerCase()) 
  }

  onSubmitParametro(form: NgForm) {
    this.carregaPedidosEmpresa(this.idEmpresa, this.dtInicio)
  }

  setarStatus() {
    this.chk_P = !this.chk_P;
    this.chk_A = !this.chk_A;
    this.chk_F = !this.chk_F;
    this.chk_E = !this.chk_E;
    this.chk_C = !this.chk_C;
    this.chk_R = !this.chk_R;
    this.chk_X = !this.chk_X;    
  }

  atualizarPedido(obj: PedidoVO) {
    let retorno = this.pedidoService.atualizarPedido(obj, this.idEmpresa);
    // this.carregaPedidosEmpresa(this.idEmpresa, this.dtInicio);
  }

  carregaPedidosEmpresa(refEmp, dtFiltro) {
    let flagInsert: boolean;
    this.listaPedidos = [];
    this.listaProdutos = [];
    this.pedidoService.carregaPedidosEmpresa(refEmp, dtFiltro)
      .then((pedidos) => {
        if(pedidos.val()!=null && pedidos.val()!=undefined) {
          pedidos.forEach((snap) => {
            flagInsert=false;
            this.objPedido = new PedidoVO();
            this.objPedido = this.pedidoService.carregaObjeto(snap);
            switch (this.objPedido.pedi_in_status) {
              case 'P':
                if(this.chk_P) {
                  flagInsert=true;
                }
                break;
              case 'A':
                if(this.chk_A) {
                  flagInsert=true;
                }
                break;
              case 'F':
                if(this.chk_F) {
                  flagInsert=true;
                }
                break;
              case 'E':
                if(this.chk_E) {
                  flagInsert=true;
                }
                break;
              case 'C':
                if(this.chk_C) {
                  flagInsert=true;
                }
                break;
              case 'R':
                if(this.chk_R) {
                  flagInsert=true;
                }
                break;
              case 'X':
                if(this.chk_X) {
                  flagInsert=true;
                }
                break;
              default: 
                break;
            }
            if (flagInsert) {
              this.listaPedidos.push(this.objPedido);
              // --- Atualizar pedido
              this.atualizarPedido(this.objPedido);
              // --- Totaliza os itens na lista de produtos
              let flagExiste: boolean = false;
              let indItens: any = Object.keys(this.objPedido.itens);
              let ind: number;
              let objItem: PedidoItemTotalVO;
              let idItem: string = '';
              let soma: number = 0;
              for (let i=0; i < indItens.length; i++) {
                idItem = this.objPedido.itens[i].tabelapreco.tapr_sq_id;
                ind = this.listaProdutos.findIndex(function (item) { return item.pito_sq_id === idItem });
                if(ind>=0) {
                  soma = this.listaProdutos[ind].pito_vl_quantidade + this.objPedido.itens[i].peit_vl_quantidade;
                  this.listaProdutos[ind].pito_vl_quantidade = soma;
                } else {
                  objItem = new PedidoItemTotalVO();
                  objItem.pito_sq_id = this.objPedido.itens[i].tabelapreco.tapr_sq_id;
                  objItem.pito_vl_quantidade = this.objPedido.itens[i].peit_vl_quantidade;
                  objItem.pito_nm_item = this.objPedido.itens[i].tabelapreco.tapr_nm_item;
                  this.listaProdutos.push(objItem);
                }
              }
              // --- Ordenando a lista de produtos
              if(this.listaProdutos.length>1) {
                this.listaProdutos = this.itemService.orderBy(this.listaProdutos, ['pito_nm_item'], ['asc']);
              }              
            }
          })
        }
      })
      .catch((err) => {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = err.message;
        this.flagHidden = false;
        setTimeout(() => { this.flagHidden = true; }, 3000);
      })
  }

  carregaPedidosEmpresaNome(refNome) {
    this.listaPedidos = [];
    this.pedidoService.carregaPedidosEmpresaNome(this.idEmpresa, refNome)
      .then((pedidos) => {
        if(pedidos.val()!=null && pedidos.val()!=undefined) {
          pedidos.forEach((snap) => {
            this.objPedido = new PedidoVO();
            this.objPedido = this.pedidoService.carregaObjeto(snap)
            this.listaPedidos.push(this.objPedido);
          })
        }
      })
      .catch((err) => {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = err.message;
        this.flagHidden = false;
        setTimeout(() => { this.flagHidden = true; }, 3000);
      })
  }
  
  verProdutos() {
    this.flagProdutos = !this.flagProdutos;
    this.carregaPedidosEmpresa(this.idEmpresa, this.dtInicio);
  }

  verItens(id) {
    if(id==this.pedidoAtual) {
      this.pedidoAtual='';
    } else {
      this.pedidoAtual = id;
    }
  }

  mudarStatus(objPedido) {
    let status = objPedido.pedi_in_status;
    let mensagem: string = '';
    switch (status) {
      case 'P':
        objPedido.pedi_in_status = 'A';
        mensagem = 'Seu pedido está sendo preparado!';
        break;
      case 'A':
        objPedido.pedi_in_status = 'F';
        mensagem = 'Pedido pronto! Aguardando entrega.';
        break;
      case 'F':
        objPedido.pedi_in_status = 'E';
        mensagem = 'Saiu para entregar!';
        break;
      case 'E':
        objPedido.pedi_in_status = 'C';
        mensagem = 'Pedido entregue e finalizado!';
        break;        
      case 'C':
        objPedido.pedi_in_status = 'R';
        mensagem = 'Pedido retornou! Entre em contato para saber mais...';
        break;
      case 'R':
        objPedido.pedi_in_status = 'X';
        mensagem = 'Pedido foi cancelado! Entre em contato para saber mais...';
        break;
      case 'X':
        objPedido.pedi_in_status = 'P';
        mensagem = 'Pedido ainda pendente.';
        break;
      default:
        objPedido.pedi_in_status = 'P';
        mensagem = 'Pedido ainda pendente.';
        break;
    }
    // Inserindo uma nova mensagem
    objPedido = this.pedidoService.novaMensagem(this.idEmpresa, objPedido, mensagem);
    this.atualizarPedido(objPedido);
  }

  ngOnDestroy() {
    console.log('Interrompendo o intervalo');
    clearInterval(this.refreshPedido);
  }

}