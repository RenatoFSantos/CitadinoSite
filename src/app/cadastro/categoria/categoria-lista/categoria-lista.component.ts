import { NgForm, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { CategoriaVO } from './../../../model/categoriaVO';
import { CategoriaService } from './../../../provider/service/categoria.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-categoria-lista',
  templateUrl: './categoria-lista.component.html',
  styleUrls: ['./categoria-lista.component.css']
})

export class CategoriaListaComponent implements OnInit {

	pagina: number = 0;
  qtdPorPagina: number = 200;
  qtdAdjacentes: number = 3;
  listaCategorias = [];
  objCategoria = [];
  categorias = [];
  totalCategorias = 0;
  totalRegistrosCat: number = 0;
  cargaCompleta:boolean = false;
  inscricao: Subscription;
  // --- MENSAGEM
  stsMensagem: string = '';
  flagHidden: boolean = true;
  txtMensagem: string = '';
  txtFiltro: string = '';


  constructor(private route: ActivatedRoute, private router: Router, private categoriaService: CategoriaService) {
    console.log('Entrei no construtor');
    this.carregarListaCategorias();
  }

  carregarListaCategorias() {
    console.log('Recarregando a Lista de Categorias');
    if(this.txtFiltro=='' || this.txtFiltro==undefined || this.txtFiltro==null) {
      console.log('getCategorias');
      this.categoriaService.getCategorias().then(snapshot => {
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
        this.carregarCategorias();
      })    
    } else {
      console.log('getCategoriasFiltro');
      this.categoriaService.getCategoriasFiltro(this.txtFiltro).then(snapshot => {
        console.log('getCategoriasFiltro - v1');
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
          this.carregarCategorias();
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

  carregaTotalCategorias() {
    this.categoriaService.getTotalRegistros()
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
    this.carregarListaCategorias();
  }

	paginar($event: any) {
		this.pagina = $event - 1;
		this.carregarCategorias();
	}

  carregarCategorias() {
    console.log('Alimentando a lista de Categorias');
    console.log('Página atual=', this.pagina);
    console.log('Total Registros=',this.totalRegistrosCat);
		this.listaCategorias = [];
		for (let i = ( this.pagina * this.qtdPorPagina ); i < (this.pagina * this.qtdPorPagina + this.qtdPorPagina); i++) {
			if (i >= this.totalRegistrosCat) {
				break;
			}
      this.listaCategorias.push(this.categorias[i]);
		}
  }
}
