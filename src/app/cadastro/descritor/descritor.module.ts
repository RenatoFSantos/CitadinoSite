import { SharedModule } from './../../shared/shared.module';
import { DescritorService } from './../../provider/service/descritor.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DescritorComponent } from './descritor.component';
import { DescritorRoutingModule } from './descritor.routing.module';
import { DescritorListaComponent } from './descritor-lista/descritor-lista.component';

import * as firebase from 'firebase';

@NgModule({
    imports: [
        CommonModule, 
        FormsModule,
        DescritorRoutingModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        DescritorComponent,
        DescritorListaComponent
    ],
    providers: [DescritorService]
})

export class DescritorModule {


}