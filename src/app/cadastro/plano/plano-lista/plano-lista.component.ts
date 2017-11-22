import { PlanoVO } from './../../../model/planoVO';
import { PlanoService } from './../../../provider/service/plano.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-plano-lista',
  templateUrl: './plano-lista.component.html',
  styleUrls: ['./plano-lista.component.css']
})

export class PlanoListaComponent implements OnInit {

  pagina: number = 0;
  qtdPorPagina: number = 10;
  qtdAdjacentes: number = 3;  
  listaPlanos = [];
  objPlano = [];
  planos = [];
  totalPlanos = 0;
  totalRegistros: number = 0;
  cargaCompleta:boolean = false;
  inscricao: Subscription;
  // --- MENSAGEM
  stsMensagem: string = '';
  flagHidden: boolean = true;
  txtMensagem: string = '';
  txtFiltro: string = '';  

  constructor(private route: ActivatedRoute, private router: Router, private planoService: PlanoService) {
    console.log('Entrei no construtor');
    this.carregarListaPlanos();
  }

  carregarListaPlanos() {
    console.log('Recarregando a Lista de Planos');
    if(this.txtFiltro=='' || this.txtFiltro==undefined || this.txtFiltro==null) {
      console.log('getPlanos');
      this.planoService.getPlanos().then(snapshot => {
        this.planos=[];
        let obj = JSON.parse(JSON.stringify(snapshot.val()));
        let indicesCat = Object.keys(obj);
  
        this.totalRegistros = indicesCat.length;
        snapshot.forEach((childSnapshot) => {
          var element = childSnapshot;
          this.planos.push(element);
          this.cargaCompleta=true;
        });
        // this.paginar(this.pagina);
        this.carregarPlanos();
      })    
    } else {
      console.log('getPlanosFiltro');
      this.planoService.getPlanosFiltro(this.txtFiltro).then(snapshot => {
        console.log('getPlanosFiltro - v1');
        if(snapshot.val()!=null && snapshot.val()!=undefined) {
          this.planos=[];
          let obj = JSON.parse(JSON.stringify(snapshot.val()));
          let indicesCat = Object.keys(obj);

          this.totalRegistros = indicesCat.length;
          snapshot.forEach((childSnapshot) => {
            var element = childSnapshot;
            this.planos.push(element);
            this.cargaCompleta=true;
          });
          // this.paginar(this.pagina);
          this.carregarPlanos();
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

  carregaTotalPlanos() {
    this.planoService.getTotalRegistros()
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
    this.carregarListaPlanos();
  }

	paginar($event: any) {
		this.pagina = $event - 1;
		this.carregarPlanos();
	}

  carregarPlanos() {
		this.listaPlanos = [];
		for (let i = ( this.pagina * this.qtdPorPagina ); i < (this.pagina * this.qtdPorPagina + this.qtdPorPagina); i++) {
			if (i >= this.totalRegistros) {
				break;
			}
      this.listaPlanos.push(this.planos[i]);
		}
  }


}
