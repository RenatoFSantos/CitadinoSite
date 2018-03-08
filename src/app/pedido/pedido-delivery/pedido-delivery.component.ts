import { EmpresaService } from './../../provider/service/empresa.service';
import { EmpresaVO } from './../../model/empresaVO';
import { forEach } from '@angular/router/src/utils/collection';
import { PedidoVO } from 'app/model/pedidoVO';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs/Rx';
import { PedidoService } from './../../provider/service/pedido.service';
import { Component, OnInit } from '@angular/core';

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

  constructor(
    private route: ActivatedRoute, 
    private router: Router,    
    private pedidoService: PedidoService,
    private empresaService: EmpresaService
  ) {}

  ngOnInit() {
    this.objEmpresa = new EmpresaVO();
    this.inscricao = this.route.params.subscribe(
      (params:any) => {
        this.idEmpresa = params['id'];
        if (this.idEmpresa!=null) {
          this.empresaService.getEmpresa(this.idEmpresa)
            .then((empresa) => {
              this.objEmpresa=empresa.val();
              console.log('Empresa selecionada=',this.objEmpresa);
              setInterval(() => {
                this.carregaPedidosEmpresa(this.objEmpresa.empr_sq_id);
              }, 3000);
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

  carregaPedidosEmpresa(refEmp) {
    let element: any;
    this.listaPedidos = [];
    this.pedidoService.carregaPedidosEmpresa(refEmp)
      .then((pedidos) => {
        if(pedidos.val()!=null && pedidos.val()!=undefined) {
          pedidos.forEach((snap) => {
            element = snap.val();
            this.listaPedidos.push(element);
            console.log('Pedido=>', element);
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

}
