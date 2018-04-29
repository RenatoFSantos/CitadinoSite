import { NgForm } from '@angular/forms';
import { PedidoVO } from './../../model/pedidoVO';
import { forEach } from '@angular/router/src/utils/collection';
import { UsuarioService } from 'app/provider/service/usuario.service';
import { UsuarioVO } from 'app/model/usuarioVO';
import { AuthService } from './../../auth.service';
import { ItemService } from './../../provider/service/item.service';
import { CtdFuncoes } from './../../../ctd-funcoes';
import { EmpresaService } from './../../provider/service/empresa.service';
import { PedidoService } from './../../provider/service/pedido.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pedido-status',
  templateUrl: './pedido-status.component.html',
  styleUrls: ['./pedido-status.component.css']
})
export class PedidoStatusComponent implements OnInit {

  stsMensagem: string = '';
  mensagem: string = '';
  flagHidden: boolean = true;
  txtMensagem: string = '';
  user: any = null;
  objUsuario: UsuarioVO;
  objPedido: PedidoVO;
  listaPedidos: Array<PedidoVO>
  imgStatus: string = '';
  codPedido: string = '';
  refreshStatus: any;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,    
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private pedidoService: PedidoService,
    private empresaService: EmpresaService,
    private ctdFuncoes: CtdFuncoes,
    private itemService: ItemService    
  ) { }

  ngOnInit() {
    this.objPedido = new PedidoVO();
    this.listaPedidos = [];
    this.user = this.authService.getLoggedInUser();
    // --- Carregando Usuario atual
    this.objUsuario = new UsuarioVO();
    this.usuarioService.getUsuario(this.user.uid)
      .then((usuario) => {
        this.objUsuario = usuario.val();
        // --- Carregando os pedidos para este usuário
        this.usuarioService.getPedidosUsuario(this.user.uid)
          .then((pedidos) => {
            if(pedidos.val()!=null && pedidos.val()!=undefined) {
              pedidos.forEach(element => {
                this.pedidoService.carregaPedido((element.val()).empr_sq_id, (element.val()).pedi_sq_id)
                  .then((pedido) => {
                    this.objPedido = new PedidoVO();
                    this.objPedido = this.pedidoService.carregaObjeto(pedido);
                    this.listaPedidos.push(this.objPedido);
                    this.setarParametros();
                  })
                  .catch((err) => {
                    this.stsMensagem = 'alert alert-dismissible alert-danger';
                    this.txtMensagem = err.message;
                    this.flagHidden = false;
                    setTimeout(() => { this.flagHidden = true; }, 3000);
                  })
              });
              this.refreshStatus = setInterval(() => {
                  console.log('Entrei na rotina do intervalo');
                  this.atualizaPedido(this.objPedido.empr_sq_id, this.objPedido.pedi_sq_id);
                  this.setarParametros();
              }, 60000)
            }
          })
      })
      .catch((err) => {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = err.message;
        this.flagHidden = false;
        setTimeout(() => { this.flagHidden = true; }, 3000);
      })

  }

  carregaPedido(idPedido) {
    let idEmpresa: string = '';
    this.listaPedidos.forEach((pedido) => {
      if(pedido.pedi_sq_id==idPedido) {
        this.objPedido = pedido;
        idEmpresa = this.objPedido.empr_sq_id;
        // --- Buscando valores mais recentes deste pedido
        this.atualizaPedido(idEmpresa, idPedido)
        this.setarParametros();
      }
    })
  }

  atualizaPedido(idEmpresa, idPedido) {
    this.pedidoService.carregaPedido(idEmpresa, idPedido)
    .then((pedido) => {
      this.objPedido = new PedidoVO();
      this.objPedido = this.pedidoService.carregaObjeto(pedido);
    })
    .catch((err) => {
      this.stsMensagem = 'alert alert-dismissible alert-danger';
      this.txtMensagem = err.message;
      this.flagHidden = false;
      setTimeout(() => { this.flagHidden = true; }, 3000);    
    })
  }

  setarParametros() {
    this.codPedido = this.objPedido.pedi_sq_id;
    switch (this.objPedido.pedi_in_status) {
      case 'P':
        this.imgStatus = 'assets/img/pedstatus-p.jpg';
        break;
      case 'A':
        this.imgStatus = 'assets/img/pedstatus-a.jpg';
        break;
      case 'F':
        this.imgStatus = 'assets/img/pedstatus-f.jpg';
        break;
      case 'E':
        this.imgStatus = 'assets/img/pedstatus-e.jpg';
        break;
      case 'C':
        this.imgStatus = 'assets/img/pedstatus-c.jpg';
        break;
      case 'R':
        this.imgStatus = 'assets/img/pedstatus-r.jpg';
        break;
      case 'X':
        this.imgStatus = 'assets/img/pedstatus-x.jpg';
        break;
      default:
        this.imgStatus = 'assets/img/pedstatus-p.jpg';
        break;
    }
  }

  onSubmit(form: NgForm) {
    this.carregaPedido(this.codPedido);
  }

  ngOnDestroy () {
    console.log('Cancelei a rotina de intervalo');
    clearInterval(this.refreshStatus);
  }
}
