import { EmpresaService } from './../../../provider/service/empresa.service';
import { EmpresaVO } from './../../../model/empresaVO';
import { MunicipioVO } from './../../../model/municipioVO';
import { MunicipioService } from './../../../provider/service/municipio.service';
import { element } from 'protractor';
import { Subscription } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';

@Component({
  selector: 'app-empresa-municipio',
  templateUrl: './empresa-municipio.component.html',
  styleUrls: ['./empresa-municipio.component.css']
})
export class EmpresaMunicipioComponent implements OnInit {
  inscricao: Subscription;
  idEmpresa: string = '';
  objMunicipios: Observable<MunicipioVO[]>;
  listaMunicipios: Array<MunicipioVO> = [];
  listaCadastroMunicipios: Array<MunicipioVO> = [];
  termosDaBusca: Subject<string> = new Subject<string>(); 
    
  empresa:EmpresaVO = new EmpresaVO();
  model:MunicipioVO = new MunicipioVO();
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private empresaService: EmpresaService, 
    private municipioService: MunicipioService
    ) { }

  ngOnInit() {
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.idEmpresa = params['id'];
        if(this.idEmpresa != null) {
          this.empresaService.getEmpresa(this.idEmpresa).then((empresa) => {
            this.empresa = this.empresaService.carregaObjeto(empresa);
          }),
          err => {
            console.log(err);
          }
        } else {
          this.idEmpresa='';
          console.log('Estou no else com o id=' + this.idEmpresa);
        }
      }
    )

    // Listar todos os municipioes da empresa
    this.carregaMunicipiosEmpresa();

    // Municipios com Observables
    this.objMunicipios = this.termosDaBusca
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => {        
        return term ? this.municipioService.search(term) : this.municipioService.allMunicipios();
      })
      .catch(err => {
        console.log(err);
        return Observable.of<MunicipioVO[]>([]);
      });

    this.objMunicipios.subscribe((objMunicipios) => {
          this.listaCadastroMunicipios = [];
          objMunicipios.forEach((element: any) => {
            this.listaCadastroMunicipios.push(element);
          })          
    })      
    
  }

  carregaMunicipiosEmpresa() {
    // Listar todos os municipioes da empresa
    this.empresaService.getEmpresaMunicipios(this.idEmpresa)
        .then(snap => {
          snap.forEach((childMunicipio) => {
            this.listaMunicipios.push(childMunicipio);
            console.log('Carregando Municipios da Empresa', childMunicipio.val().muni_nm_municipio);
        });
    })    
  }

  selecionaMunicipio(chv, valor, tipo) {
    let municipio:MunicipioVO = new MunicipioVO();
    let ind;
    municipio.muni_sq_id = chv;
    municipio.muni_nm_municipio = valor.muni_nm_municipio;

    // --- Inserindo/Excluir municipio
    this.empresaService.atualizarEmpresaMunicipio(this.empresa, municipio, tipo)
        .then(() => {
            this.listaMunicipios = [];
            this.carregaMunicipiosEmpresa();
        }).catch((err) => {
            throw err;
        });
    
  }   

  buscarMunicipioPorNome(term:string) {
      this.termosDaBusca.next(term);
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

}
