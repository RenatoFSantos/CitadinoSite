import { EmpresaVO } from './../../../model/empresaVO';
import { EmpresaService } from './../../../provider/service/empresa.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-empresa-lista',
  templateUrl: './empresa-lista.component.html',
  styleUrls: ['./empresa-lista.component.css']
})

export class EmpresaListaComponent implements OnInit {

  pagina: number = 0;
  qtdPorPagina: number = 200;
  qtdAdjacentes: number = 3;  
  listaEmpresas = [];
  objEmpresa = [];
  empresas = [];
  totalEmpresas = 0;
  totalRegistros: number = 0;
  cargaCompleta:boolean = false;
  inscricao: Subscription;
  // --- MENSAGEM
  stsMensagem: string = '';
  flagHidden: boolean = true;
  txtMensagem: string = '';
  txtFiltro: string = '';  

  constructor(private route: ActivatedRoute, private router: Router, private empresaService: EmpresaService) {
    console.log('Entrei no construtor');
    this.carregarListaEmpresas();
  }

  carregarListaEmpresas() {
    console.log('Recarregando a Lista de Empresas');
    if(this.txtFiltro=='' || this.txtFiltro==undefined || this.txtFiltro==null) {
      console.log('getEmpresas');
      this.empresaService.getEmpresas().then(snapshot => {
        this.empresas=[];
        let obj = JSON.parse(JSON.stringify(snapshot.val()));
        let indicesCat = Object.keys(obj);
  
        this.totalRegistros = indicesCat.length;
        snapshot.forEach((childSnapshot) => {
          var element = childSnapshot;
          this.empresas.push(element);
          this.cargaCompleta=true;
        });
        // this.paginar(this.pagina);
        this.carregarEmpresas();
      })    
    } else {
      console.log('getEmpresasFiltro');
      this.empresaService.getEmpresasFiltro(this.txtFiltro).then(snapshot => {
        console.log('getEmpresasFiltro - v1');
        if(snapshot.val()!=null && snapshot.val()!=undefined) {
          this.empresas=[];
          let obj = JSON.parse(JSON.stringify(snapshot.val()));
          let indicesCat = Object.keys(obj);

          this.totalRegistros = indicesCat.length;
          snapshot.forEach((childSnapshot) => {
            var element = childSnapshot;
            this.empresas.push(element);
            this.cargaCompleta=true;
          });
          // this.paginar(this.pagina);
          this.carregarEmpresas();
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

  carregaTotalEmpresas() {
    this.empresaService.getTotalRegistros()
    .then(totreg => {
      this.totalRegistros = totreg;
    });    
  }

  ngOnInit() {
  }

  ngOnChange() {
    console.log('onChange disparado');
  }

  onSubmit(form:NgForm) {
    // this.txtFiltro = this.txtFiltro.toLowerCase();
    this.pagina = 0;
    console.log('Filtro=', this.txtFiltro);
    this.carregarListaEmpresas();
  }

	paginar($event: any) {
		this.pagina = $event - 1;
		this.carregarEmpresas();
	}

  carregarEmpresas() {
		this.listaEmpresas = [];
		for (let i = ( this.pagina * this.qtdPorPagina ); i < (this.pagina * this.qtdPorPagina + this.qtdPorPagina); i++) {
			if (i >= this.totalRegistros) {
				break;
			}
      this.listaEmpresas.push(this.empresas[i]);
		}
  }
}
