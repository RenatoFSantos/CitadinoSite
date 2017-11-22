import { TipoAnuncioService } from './../../../provider/service/tipoanuncio.service';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tipoanuncio-lista',
  templateUrl: './tipoanuncio-lista.component.html',
  styleUrls: ['./tipoanuncio-lista.component.css']
})

export class TipoAnuncioListaComponent implements OnInit {

  pagina: number = 0;
  qtdPorPagina: number = 10;
  qtdAdjacentes: number = 3;  
  listaTipoAnuncios = [];
  objTipoAnuncio = [];
  tipoanuncios = [];
  totalTipoAnuncios = 0;
  totalRegistros: number = 0;
  cargaCompleta:boolean = false;
  inscricao: Subscription;
  // --- MENSAGEM
  stsMensagem: string = '';
  flagHidden: boolean = true;
  txtMensagem: string = '';
  txtFiltro: string = ''; 

  constructor(private route: ActivatedRoute, private router: Router, private tipoanuncioService: TipoAnuncioService) {
    console.log('Entrei no construtor');
    this.carregarListaTipoAnuncios();
  }

  carregarListaTipoAnuncios() {
    console.log('Recarregando a Lista de TipoAnuncios');
    if(this.txtFiltro=='' || this.txtFiltro==undefined || this.txtFiltro==null) {
      console.log('getTipoAnuncios');
      this.tipoanuncioService.getTipoAnuncios().then(snapshot => {
        this.tipoanuncios=[];
        let obj = JSON.parse(JSON.stringify(snapshot.val()));
        let indicesCat = Object.keys(obj);
  
        this.totalRegistros = indicesCat.length;
        snapshot.forEach((childSnapshot) => {
          var element = childSnapshot;
          this.tipoanuncios.push(element);
          this.cargaCompleta=true;
        });
        // this.paginar(this.pagina);
        this.carregarTipoAnuncios();
      })    
    } else {
      console.log('getTipoAnunciosFiltro');
      this.tipoanuncioService.getTipoAnunciosFiltro(this.txtFiltro).then(snapshot => {
        console.log('getTipoAnunciosFiltro - v1');
        if(snapshot.val()!=null && snapshot.val()!=undefined) {
          this.tipoanuncios=[];
          let obj = JSON.parse(JSON.stringify(snapshot.val()));
          let indicesCat = Object.keys(obj);

          this.totalRegistros = indicesCat.length;
          snapshot.forEach((childSnapshot) => {
            var element = childSnapshot;
            this.tipoanuncios.push(element);
            this.cargaCompleta=true;
          });
          // this.paginar(this.pagina);
          this.carregarTipoAnuncios();
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

  carregaTotalTipoAnuncios() {
    this.tipoanuncioService.getTotalRegistros()
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
    this.carregarListaTipoAnuncios();
  }

	paginar($event: any) {
		this.pagina = $event - 1;
		this.carregarTipoAnuncios();
	}

  carregarTipoAnuncios() {
		this.listaTipoAnuncios = [];
		for (let i = ( this.pagina * this.qtdPorPagina ); i < (this.pagina * this.qtdPorPagina + this.qtdPorPagina); i++) {
			if (i >= this.totalRegistros) {
				break;
			}
      this.listaTipoAnuncios.push(this.tipoanuncios[i]);
		}
  }

}
