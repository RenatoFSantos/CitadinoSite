import { NgForm, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';
import { MunicipioVO } from './../../../model/municipioVO';
import { MunicipioService } from './../../../provider/service/municipio.service';
import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-municipio-lista',
  templateUrl: './municipio-lista.component.html',
  styleUrls: ['./municipio-lista.component.css']
})

export class MunicipioListaComponent implements OnInit {

  pagina: number = 0;
  qtdPorPagina: number = 10;
  qtdAdjacentes: number = 3;  
  listaMunicipios = [];
  objMunicipio = [];
  municipios = [];
  totalMunicipios = 0;
  totalRegistros: number = 0;
  cargaCompleta:boolean = false;
  inscricao: Subscription;
  // --- MENSAGEM
  stsMensagem: string = '';
  flagHidden: boolean = true;
  txtMensagem: string = '';
  txtFiltro: string = '';  

  constructor(private route: ActivatedRoute, private router: Router, private municipioService: MunicipioService) {
    console.log('Entrei no construtor');
    this.carregarListaMunicipios();
  }

  carregarListaMunicipios() {
    console.log('Recarregando a Lista de Municipios');
    if(this.txtFiltro=='' || this.txtFiltro==undefined || this.txtFiltro==null) {
      console.log('getMunicipios');
      this.municipioService.getMunicipios().then(snapshot => {
        this.municipios=[];
        let obj = JSON.parse(JSON.stringify(snapshot.val()));
        let indicesCat = Object.keys(obj);
  
        this.totalRegistros = indicesCat.length;
        snapshot.forEach((childSnapshot) => {
          var element = childSnapshot;
          this.municipios.push(element);
          this.cargaCompleta=true;
        });
        // this.paginar(this.pagina);
        this.carregarMunicipios();
      })    
    } else {
      console.log('getMunicipiosFiltro');
      this.municipioService.getMunicipiosFiltro(this.txtFiltro).then(snapshot => {
        console.log('getMunicipiosFiltro - v1');
        if(snapshot.val()!=null && snapshot.val()!=undefined) {
          this.municipios=[];
          let obj = JSON.parse(JSON.stringify(snapshot.val()));
          let indicesCat = Object.keys(obj);

          this.totalRegistros = indicesCat.length;
          snapshot.forEach((childSnapshot) => {
            var element = childSnapshot;
            this.municipios.push(element);
            this.cargaCompleta=true;
          });
          // this.paginar(this.pagina);
          this.carregarMunicipios();
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

  carregaTotalMunicipios() {
    this.municipioService.getTotalRegistros()
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
    this.carregarListaMunicipios();
  }

	paginar($event: any) {
		this.pagina = $event - 1;
		this.carregarMunicipios();
	}

  carregarMunicipios() {
		this.listaMunicipios = [];
		for (let i = ( this.pagina * this.qtdPorPagina ); i < (this.pagina * this.qtdPorPagina + this.qtdPorPagina); i++) {
			if (i >= this.totalRegistros) {
				break;
			}
      this.listaMunicipios.push(this.municipios[i]);
		}
  }

}
