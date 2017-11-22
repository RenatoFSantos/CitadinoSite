import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanoService } from './../../provider/service/plano.service';
import {  
  FormsModule, 
  ReactiveFormsModule
} from '@angular/forms';

import { PlanoComponent } from './plano.component';
import { PlanoListaComponent } from './plano-lista/plano-lista.component';
import { PlanoRoutingModule } from './plano.routing.module';

import * as firebase from 'firebase';

@NgModule({
    declarations: [
        PlanoComponent,
        PlanoListaComponent
    ],
    imports: [
        CommonModule, 
        FormsModule,
        PlanoRoutingModule,
        SharedModule
    ],
    providers: [ PlanoService ]
})

export class PlanoModule {

}