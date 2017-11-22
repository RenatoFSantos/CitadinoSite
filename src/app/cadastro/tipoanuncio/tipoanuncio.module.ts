import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoAnuncioService } from './../../provider/service/tipoanuncio.service';
import {  
  FormsModule, 
  ReactiveFormsModule
} from '@angular/forms';

import { TipoAnuncioComponent } from './tipoanuncio.component';
import { TipoAnuncioListaComponent } from './tipoanuncio-lista/tipoanuncio-lista.component';
import { TipoAnuncioRoutingModule } from './tipoanuncio.routing.module';

import * as firebase from 'firebase';

@NgModule({
    declarations: [
        TipoAnuncioComponent,
        TipoAnuncioListaComponent
    ],
    imports: [
        CommonModule, 
        FormsModule,
        TipoAnuncioRoutingModule,
        SharedModule
    ],
    providers: [TipoAnuncioService]
})

export class TipoAnuncioModule {

}