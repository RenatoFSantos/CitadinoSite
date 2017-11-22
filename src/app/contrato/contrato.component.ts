import { Subscription } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.css']
})
export class ContratoComponent implements OnInit {

  tela: string;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    console.log('onInit');
    this.route
      .queryParams
      .subscribe(params => {
        this.tela = params['tela'];
        console.log('Tela=', this.tela);
      });    
  }

}
