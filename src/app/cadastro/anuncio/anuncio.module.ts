import { SharedModule } from './../../shared/shared.module';
import { AnuncioService } from './../../provider/service/anuncio.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AnuncioComponent } from './anuncio.component';
import { AnuncioRoutingModule } from './anuncio.routing.module';
import { AnuncioListaComponent } from './anuncio-lista/anuncio-lista.component';

import * as firebase from 'firebase';
import { AnuncioAgendaComponent } from './anuncio-agenda/anuncio-agenda.component';

@NgModule({
    imports: [
        CommonModule, 
        FormsModule,
        AnuncioRoutingModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        AnuncioComponent,
        AnuncioListaComponent,
        AnuncioAgendaComponent
    ],
    providers: [AnuncioService]
})

export class AnuncioModule {


}