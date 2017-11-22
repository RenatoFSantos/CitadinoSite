import { SharedModule } from './../../shared/shared.module';
import { AgendaService } from './../../provider/service/agenda.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AgendaComponent } from './agenda.component';
import { AgendaRoutingModule } from './agenda.routing.module';
import { AgendaListaComponent } from './agenda-lista/agenda-lista.component';

import * as firebase from 'firebase';

@NgModule({
    imports: [
        CommonModule, 
        FormsModule,
        AgendaRoutingModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        AgendaComponent,
        AgendaListaComponent
    ],
    providers: [AgendaService]
})

export class AgendaModule {


}