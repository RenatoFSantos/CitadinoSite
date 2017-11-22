import { MunicipioVO } from './../../../model/municipioVO';
import { MunicipioService } from './../../../provider/service/municipio.service';
import { CtdFuncoes } from './../../../../ctd-funcoes';
import { NgForm } from '@angular/forms';
import { VitrineVO } from './../../../model/vitrineVO';
import { VitrineService } from './../../../provider/service/vitrine.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

declare var jQuery:any;

@Component({
  selector: 'app-vitrine-lista',
  templateUrl: './vitrine-lista.component.html',
  styleUrls: ['./vitrine-lista.component.css']
})

export class VitrineListaComponent implements OnInit {

  pagina: number = 0;
  qtdPorPagina: number = 200;
  qtdAdjacentes: number = 3;
  objVitrine = [];
  vitrines = [];
  totalVitrines = 0;
  totalRegistros: number = 0;
  cargaCompleta:boolean = false;

  txtFiltro: string = '';  

  listaVitrines = [];
  listaMunicipios = [];
  idMunicipioAtual: string = '';
  dtFiltro: string;
  modo: string;
  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;
  model: VitrineVO = new VitrineVO();
  intervalo: any;

  constructor(private route: ActivatedRoute, private router: Router, private vitrineService: VitrineService, private municipioService:MunicipioService) { 
  }

  ngOnInit() {
    this.modo = 'Municipio'; // apresenta a visão de municipio
    this.municipioService.getMunicipios()
    .then(snapshot => {
      let objMunicipio: MunicipioVO;
      snapshot.forEach(element => {
        objMunicipio = new MunicipioVO();
        objMunicipio = element.val();
        this.listaMunicipios.push(objMunicipio)
      });
    })
  }

  alteraVisao() {
    this.modo='Municipio';
  }

  onSubmit(form:NgForm) {
    this.modo='Vitrine';
    let dtLimite: Date = new Date(this.dtFiltro);
    let dtAgendada: Date
    let objVitrine: VitrineVO;
    this.vitrines=[];
    this.vitrineService.getVitrinesFiltro(this.idMunicipioAtual, this.dtFiltro)
    .then(snapshot => {
      if(snapshot.val()!=null && snapshot.val()!=undefined) {        
        let obj = JSON.parse(JSON.stringify(snapshot.val()));
        let indicesCat = Object.keys(obj);
        this.totalRegistros = indicesCat.length;          
        snapshot.forEach((element) => {
          objVitrine = new VitrineVO();
          objVitrine = element.val();
          dtAgendada = new Date(objVitrine.vitr_dt_agendada);
          let mmDtAgendada = moment(dtAgendada, "YYYY-MM-DD");
          let mmDtLimite = moment(dtLimite, "YYYY-MM-DD")
          // Verificando se a data corresponde ao filtro selecionado
          if(moment(mmDtAgendada).isSame(mmDtLimite)) {
            this.vitrines.push(objVitrine);
          }
        });
        this.carregarVitrines();
      } else {
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Nenhum registro filtrado!';
        this.flagHidden = false;
        setTimeout(() => { this.flagHidden = true; }, 3000);        
      }
    })
  }

  listarVitrinesPorMunicipio(idMunicipio: string) {
    console.log('Set Interval - 3');
    this.vitrines=[];
    this.modo = 'Vitrine'; // apresenta a visão de vitrine
    this.idMunicipioAtual = idMunicipio;
    
    this.vitrineService.getVitrinesPorMunicipio(idMunicipio)
    .then(snapshot => {
      if(snapshot.val()!=null && snapshot.val()!=undefined) {      
        let obj = JSON.parse(JSON.stringify(snapshot.val()));
        let indicesCat = Object.keys(obj);
        this.totalRegistros = indicesCat.length;          
        let objVitrine: VitrineVO;
        this.dtFiltro = CtdFuncoes.convertDateToStr(new Date(), 1);
        snapshot.forEach((element) => {
          objVitrine = new VitrineVO();
          objVitrine = element.val();
          this.vitrines.push(objVitrine);
        });
        this.carregarVitrines();    
        jQuery("#modalPublicacao").modal("hide");
      } else {
        jQuery("#modalPublicacao").modal("hide");
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Nenhum registro filtrado!';
        this.flagHidden = false;
        setTimeout(() => { this.flagHidden = true; }, 3000);        
      }
    })
  }

  excluirVitrine(obj: VitrineVO) {
    this.vitrineService.excluirVitrine(obj)
    .then(() => {
      jQuery("#modalPublicacao").modal("hide");
      this.stsMensagem = 'alert alert-dismissible alert-success';
      this.txtMensagem = 'Anúncio excluído!';
      this.flagHidden = false;
      setInterval(() => { this.flagHidden = true; }, 3000);
    }).catch((err) => {
        jQuery("#modalPublicacao").modal("hide");
        this.stsMensagem = 'alert alert-dismissible alert-danger';
        this.txtMensagem = 'Não foi possível excluir o anúncio. Verifique!';
        this.flagHidden = false;
        setInterval(() => { this.flagHidden = true; }, 3000);
    });
  }

  excluirTodasVitrines() {
    if(this.listaVitrines.length>0) {
      let loop = 0;
      this.listaVitrines.forEach(element => {
        this.vitrineService.getVitrine(element.muni_sq_id, element.vitr_sq_id)
        .then(snapVitrine => {
          this.vitrineService.carregaObjeto(snapVitrine)
          .then(elementoVitrine => {
            this.model = elementoVitrine;
            this.vitrineService.excluirVitrine(this.model)
            .then(() => {
              // jQuery("#modalPublicacao").modal("hide");
              this.stsMensagem = 'alert alert-dismissible alert-success';
              this.txtMensagem = 'Anúncio excluído!';
              this.flagHidden = false;
              loop++;
              console.log('loop=', loop);
              console.log('listaVitrines total=', this.listaVitrines.length);
              if(this.listaVitrines.length==loop) {
                this.intervalo = setTimeout(() => {
                  console.log('Set Interval - 1');
                  this.recarregarVitrine();
                }, 3000)
              }
            }).catch((err) => {
                // jQuery("#modalPublicacao").modal("hide");
                this.stsMensagem = 'alert alert-dismissible alert-danger';
                this.txtMensagem = 'Não foi possível excluir o anúncio. Verifique!';
                this.flagHidden = false;
                this.intervalo = setTimeout(() => {
                  console.log('Set Interval - 1');
                  this.recarregarVitrine();
                }, 3000)
            });
          })
          .catch(err => {
            // jQuery("#modalPublicacao").modal("hide");
            this.stsMensagem = 'alert alert-dismissible alert-danger';
            this.txtMensagem = 'Ocorreu um erro no momento de excluir o anúncio.';
            this.flagHidden = false;          
            this.intervalo = setTimeout(() => {
              console.log('Set Interval - 1');
              this.recarregarVitrine();
            }, 3000)
          })
        })
      });
      
    } else {
    }
  }

  recarregarVitrine() {
    console.log('Set Interval - 2');
    jQuery("#modalPublicacao").modal("hide");
    this.listarVitrinesPorMunicipio(this.idMunicipioAtual);
    this.flagHidden = true;
  }

  paginar($event: any) {
		this.pagina = $event - 1;
		this.carregarVitrines();
	}

  carregarVitrines() {
		this.listaVitrines = [];
		for (let i = ( this.pagina * this.qtdPorPagina ); i < (this.pagina * this.qtdPorPagina + this.qtdPorPagina); i++) {
			if (i >= this.totalRegistros) {
				break;
			}
      this.listaVitrines.push(this.vitrines[i]);
		}
  }
}
