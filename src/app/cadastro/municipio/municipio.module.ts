import { MunicipioListaComponent } from './municipio-lista/municipio-lista.component';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MunicipioComponent } from './municipio.component';
import { MunicipioRoutingModule } from './municipio.routing.module';

import * as firebase from 'firebase';
import { MunicipioService } from './../../provider/service/municipio.service';

@NgModule({
    imports: [
        CommonModule, 
        FormsModule,
        MunicipioRoutingModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        MunicipioComponent,
        MunicipioListaComponent
    ],
    providers: [MunicipioService]
})

export class MunicipioModule {


}