import { NgForm, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CategoriaPSService } from './../../../provider/service/categoria-ps.service';

@Component({
  selector: 'app-categoria-ps-lista',
  templateUrl: './categoria-ps-lista.component.html',
  styleUrls: ['./categoria-ps-lista.component.css']
})
export class CategoriaPsListaComponent implements OnInit {

	pagina: number = 0;
  qtdPorPagina: number = 200;
  qtdAdjacentes: number = 3;
  listaCategoriaPS = [];
  objCategoriaPS = [];
  categorias = [];
  totalCategoriaPSsPS = 0;
  totalRegistrosCat: number = 0;
  cargaCompleta:boolean = false;
  inscricao: Subscription;
  // --- MENSAGEM
  stsMensagem: string = '';
  flagHidden: boolean = true;
  txtMensagem: string = '';
  txtFiltro: string = '';


  constructor(private route: ActivatedRoute, private router: Router, private categoriapsService: CategoriaPSService) {
    console.log('Entrei no construtor');
    this.carregarListaCategoriaPS();
  }

  carregarListaCategoriaPS() {
    console.log('Recarregando a Lista de CategoriaPSsPS');
    if(this.txtFiltro=='' || this.txtFiltro==undefined || this.txtFiltro==null) {
      console.log('getCategoriaPSsPS');
      this.categoriapsService.getCategorias().then(snapshot => {
        this.categorias=[];
        let obj = JSON.parse(JSON.stringify(snapshot.val()));
        let indicesCat = Object.keys(obj);
  
        this.totalRegistrosCat = indicesCat.length;
        snapshot.forEach((childSnapshot) => {
          var element = childSnapshot;
          this.categorias.push(element);
          this.cargaCompleta=true;
        });
        // this.paginar(this.pagina);
        this.carregarCategoriaPS();
      })    
    } else {
      this.categoriapsService.getCategoriasFiltro(this.txtFiltro).then(snapshot => {
        if(snapshot.val()!=null && snapshot.val()!=undefined) {
          this.categorias=[];
          let obj = JSON.parse(JSON.stringify(snapshot.val()));
          let indicesCat = Object.keys(obj);

          this.totalRegistrosCat = indicesCat.length;
          snapshot.forEach((childSnapshot) => {
            var element = childSnapshot;
            this.categorias.push(element);
            this.cargaCompleta=true;
          });
          // this.paginar(this.pagina);
          this.carregarCategoriaPS();
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

  carregaTotalCategoriaPSs() {
    this.categoriapsService.getTotalRegistros()
    .then(totreg => {
      this.totalRegistrosCat = totreg;
    });    
  }

  ngOnInit() {
  }

  ngOnChange() {
    console.log('onChange disparado');
  }

  onSubmit(form:NgForm) {
    this.txtFiltro = this.txtFiltro.toLowerCase();
    this.pagina = 0;
    console.log('Filtro=', this.txtFiltro);
    this.carregarListaCategoriaPS();
  }

	paginar($event: any) {
		this.pagina = $event - 1;
		this.carregarCategoriaPS();
	}

  carregarCategoriaPS() {
    console.log('Alimentando a lista de CategoriaPSsPS');
    console.log('Página atual=', this.pagina);
    console.log('Total Registros=',this.totalRegistrosCat);
		this.listaCategoriaPS = [];
		for (let i = ( this.pagina * this.qtdPorPagina ); i < (this.pagina * this.qtdPorPagina + this.qtdPorPagina); i++) {
			if (i >= this.totalRegistrosCat) {
				break;
			}
      this.listaCategoriaPS.push(this.categorias[i]);
		}
  }

}
