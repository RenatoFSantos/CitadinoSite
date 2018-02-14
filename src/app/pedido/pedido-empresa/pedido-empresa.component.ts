import { EmpresaService } from './../../provider/service/empresa.service';
import { NgForm, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, NgModule } from '@angular/core';

@Component({
  selector: 'app-pedido-empresa',
  templateUrl: './pedido-empresa.component.html',
  styleUrls: ['./pedido-empresa.component.css']
})
export class PedidoEmpresaComponent implements OnInit {

  pagina: number = 0;
  qtdPorPagina: number = 200;
  qtdAdjacentes: number = 3;
  listaEmpresas = [];
  empresas = [];
  totalEmpresas = 0;
  totalRegistros: number = 0;
  // --- MENSAGEM
  stsMensagem: string = '';
  flagHidden: boolean = true;
  txtMensagem: string = '';
  txtFiltro: string = '';  

  constructor(private empresaService: EmpresaService) {
    this.carregarListaEmpresaPedido();
  }

  ngOnInit() {
  }

  carregarListaEmpresaPedido() {
    if(this.txtFiltro=='' || this.txtFiltro==undefined || this.txtFiltro==null) {
      this.empresaService.getEmpresasPedido(true).then(snapshot => {
        this.empresas=[];
        let obj = JSON.parse(JSON.stringify(snapshot.val()));
        let indicesCat = Object.keys(obj);
  
        this.totalRegistros = indicesCat.length;
        snapshot.forEach((childSnapshot) => {
          var element = childSnapshot.val();
          this.empresas.push(element);
        });
        this.carregarEmpresasPedido();
      })    
    } else {
      this.empresaService.getEmpresasFiltro(this.txtFiltro).then(snapshot => {
        if(snapshot.val()!=null && snapshot.val()!=undefined) {
          this.empresas=[];
          let obj = JSON.parse(JSON.stringify(snapshot.val()));
          let indicesCat = Object.keys(obj);
          this.totalRegistros = indicesCat.length;
          snapshot.forEach((childSnapshot) => {
            var element = childSnapshot.val();
            if(element.empr_in_delivery) {
              this.empresas.push(element);
            }
          });
          if(this.empresas.length>0) {
            this.carregarEmpresasPedido();
          } else {
            this.stsMensagem = 'alert alert-dismissible alert-danger';
            this.txtMensagem = 'Desculpe, mas esta empresa não faz entregas. Tente outra!';
            this.flagHidden = false;
            setTimeout(() => { this.flagHidden = true; }, 3000);              
          }
        } else {
          this.stsMensagem = 'alert alert-dismissible alert-danger';
          this.txtMensagem = 'Nenhum registro filtrado!';
          this.flagHidden = false;
          setTimeout(() => { this.flagHidden = true; }, 3000);
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

  carregarEmpresasPedido() {
    this.listaEmpresas = [];
    // --- Ordenar Lista de Empresas por ordem alfabética
    // this.empresas = this.utilLodashService.orderBy(this.empresas, ['empr_nm_empresa'], ['asc']);
		for (let i = ( this.pagina * this.qtdPorPagina ); i < (this.pagina * this.qtdPorPagina + this.qtdPorPagina); i++) {
			if (i >= this.totalRegistros) {
				break;
			}
      this.listaEmpresas.push(this.empresas[i]);
		}
  }

  onSubmit(form:NgForm) {
    // this.txtFiltro = this.txtFiltro.toLowerCase();
    this.pagina = 0;
    this.carregarListaEmpresaPedido();
  }

	paginar($event: any) {
		this.pagina = $event - 1;
		this.carregarEmpresasPedido();
	}  

}
