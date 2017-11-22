import { VitrineService } from './../../provider/service/vitrine.service';
import { VitrineVO } from './../../model/vitrineVO';
import { element } from 'protractor';
import { Subscription } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import * as firebase from 'firebase';

@Component({
  selector: 'app-vitrine',
  templateUrl: './vitrine.component.html',
  styleUrls: ['./vitrine.component.css']
})
export class VitrineComponent implements OnInit {

  inscricao: Subscription;
  idMunicipio: string = '';
  idVitrine: string = '';
  stsMensagem: string = 'alert alert-dismissible';
  txtMensagem: string = '';
  flagHidden: boolean = true;  
  modo: string = 'editar';
  tituloManutencao = 'Inserir Agenda'; 

  vitrine:VitrineVO = new VitrineVO();
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private vitrineService: VitrineService
    ) { }

  ngOnInit() {
    this.inscricao = this.route.params.subscribe(
      (params: any) => {
        this.idMunicipio = params['idMunicipio'];
        this.idVitrine = params['idVitrine'];
        if(this.idMunicipio != null) {
          this.vitrineService.getVitrine(this.idMunicipio, this.idVitrine).then((vitrine) => {
            this.vitrine = vitrine.val();
          }),
          err => {
            console.log(err);
          }
        } else {

        }
      }
    )
  }

  excluirVitrine() {
    this.vitrineService.excluirVitrine(this.vitrine)
    .then(() => {
        this.stsMensagem = 'alert alert-dismissible alert-success';
        this.txtMensagem = 'Publicação excluída!';
        this.flagHidden = false;          
        this.modo='Municipio';
        // this.router.navigate([`vitrine/lista`]);
    }).catch(function(error) {

    });
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }


}
