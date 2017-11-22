import { NgForm, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { DescritorVO } from './../../../model/descritorVO';
import { DescritorService } from './../../../provider/service/descritor.service';
import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-descritor-lista',
  templateUrl: './descritor-lista.component.html',
  styleUrls: ['./descritor-lista.component.css']
})

export class DescritorListaComponent implements OnInit {

	pagina: number = 0;
  qtdPorPagina: number = 200;
  qtdAdjacentes: number = 3;
  listaDescritors = [];
  objDescritor = [];
  descritors = [];
  totalDescritors = 0;
  totalRegistros: number = 0;
  cargaCompleta:boolean = false;
  inscricao: Subscription;
  // --- MENSAGEM
  stsMensagem: string = '';
  flagHidden: boolean = true;
  txtMensagem: string = '';
  txtFiltro: string = '';  

  constructor(private route: ActivatedRoute, private router: Router, private descritorService: DescritorService) {
    console.log('Construtor do Descritor Lista');
    this.carregarListaDescritores();
  }

  carregarListaDescritores() {
    console.log('Recarregando a Lista de Descritores');
    if(this.txtFiltro=='' || this.txtFiltro==undefined || this.txtFiltro==null) {
      this.descritorService.getDescritors().then(snapshot => {
        this.descritors=[];
        let obj = JSON.parse(JSON.stringify(snapshot.val()));
        let indicesCat = Object.keys(obj);
  
        this.totalRegistros = indicesCat.length;
        snapshot.forEach((childSnapshot) => {
          var element = childSnapshot;
          this.descritors.push(element);
          this.cargaCompleta=true;
        });
        // this.paginar(this.pagina);
        this.carregarDescritors();
      })    
    } else {
      this.descritorService.getDescritorsFiltro(this.txtFiltro).then(snapshot => {
        if(snapshot.val()!=null && snapshot.val()!=undefined) {
          this.descritors=[];
          let obj = JSON.parse(JSON.stringify(snapshot.val()));
          let indicesCat = Object.keys(obj);

          this.totalRegistros = indicesCat.length;
          snapshot.forEach((childSnapshot) => {
            var element = childSnapshot;
            this.descritors.push(element);
            this.cargaCompleta=true;
          });
          // this.paginar(this.pagina);
          this.carregarDescritors();
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

  carregaTotalDescritores() {
    this.descritorService.getTotalRegistros()
    .then(totreg => {
      this.totalRegistros = totreg;
    });    
  }

  ngOnInit() {
    this.carregarDescritors();
  }

  ngOnChange() {
    console.log('onChange disparado');
  }

  onSubmit(form:NgForm) {
    this.txtFiltro = this.txtFiltro.toLowerCase();
    this.pagina = 0;
    console.log('Filtro=', this.txtFiltro);
    this.carregarListaDescritores();
  }

	paginar($event: any) {
		this.pagina = $event - 1;
		this.carregarDescritors();
	}

  carregarDescritors() {
		this.listaDescritors = [];
		for (let i = ( this.pagina * this.qtdPorPagina ); i < (this.pagina * this.qtdPorPagina + this.qtdPorPagina); i++) {
      console.log('Total Registros no For = ', this.totalRegistros);
			if (i >= this.totalRegistros) {
				break;
			}
			this.listaDescritors.push(this.descritors[i]);
		}
  }
}
