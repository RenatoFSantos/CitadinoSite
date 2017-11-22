import { Component, OnInit, NgModule } from '@angular/core';
import { AnuncioVO } from './../../../model/anuncioVO';
import { AnuncioService } from './../../../provider/service/anuncio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-anuncio-lista',
  templateUrl: './anuncio-lista.component.html',
  styleUrls: ['./anuncio-lista.component.css']
})

export class AnuncioListaComponent implements OnInit {

  pagina: number = 0;
  qtdPorPagina: number = 200;
  qtdAdjacentes: number = 3;  
  listaAnuncios = [];
  objAnuncio = [];
  anuncios = [];
  totalAnuncios = 0;
  totalRegistros: number = 0;
  cargaCompleta:boolean = false;
  inscricao: Subscription;
  // --- MENSAGEM
  stsMensagem: string = '';
  flagHidden: boolean = true;
  txtMensagem: string = '';
  txtFiltro: string = '';  

  constructor(private route: ActivatedRoute, private router: Router, private anuncioService: AnuncioService) {
    console.log('Entrei no construtor');
    this.carregarListaAnuncios();
  }

  carregarListaAnuncios() {
    console.log('Recarregando a Lista de Anuncios');
    if(this.txtFiltro=='' || this.txtFiltro==undefined || this.txtFiltro==null) {
      console.log('getAnuncios');
      this.anuncioService.getAnuncios().then(snapshot => {
        this.anuncios=[];
        let obj = JSON.parse(JSON.stringify(snapshot.val()));
        let indicesCat = Object.keys(obj);
  
        this.totalRegistros = indicesCat.length;
        snapshot.forEach((childSnapshot) => {
          var element = childSnapshot;
          this.anuncios.push(element);
          this.cargaCompleta=true;
        });
        // this.paginar(this.pagina);
        this.carregarAnuncios();
      })    
    } else {
      console.log('getAnunciosFiltro');
      this.anuncioService.getAnunciosFiltro(this.txtFiltro).then(snapshot => {
        console.log('getAnunciosFiltro - v1');
        if(snapshot.val()!=null && snapshot.val()!=undefined) {
          this.anuncios=[];
          let obj = JSON.parse(JSON.stringify(snapshot.val()));
          let indicesCat = Object.keys(obj);

          this.totalRegistros = indicesCat.length;
          snapshot.forEach((childSnapshot) => {
            var element = childSnapshot;
            this.anuncios.push(element);
            this.cargaCompleta=true;
          });
          // this.paginar(this.pagina);
          this.carregarAnuncios();
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

  carregaTotalAnuncios() {
    this.anuncioService.getTotalRegistros()
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
    this.carregarListaAnuncios();
  }

	paginar($event: any) {
		this.pagina = $event - 1;
		this.carregarAnuncios();
	}

  carregarAnuncios() {
		this.listaAnuncios = [];
		for (let i = ( this.pagina * this.qtdPorPagina ); i < (this.pagina * this.qtdPorPagina + this.qtdPorPagina); i++) {
			if (i >= this.totalRegistros) {
				break;
			}
      this.listaAnuncios.push(this.anuncios[i]);
      console.log('Anúncio=', this.anuncios[i]);
		}
  }

}
