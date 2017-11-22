import { SharedModule } from './../../shared/shared.module';
import { CategoriaService } from './../../provider/service/categoria.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CategoriaComponent } from './categoria.component';
import { CategoriaRoutingModule } from './categoria.routing.module';
import { CategoriaListaComponent } from './categoria-lista/categoria-lista.component';

import * as firebase from 'firebase';

@NgModule({
    imports: [
        CommonModule, 
        FormsModule,
        CategoriaRoutingModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        CategoriaComponent,
        CategoriaListaComponent
    ],
    providers: [CategoriaService]
})

export class CategoriaModule {


}