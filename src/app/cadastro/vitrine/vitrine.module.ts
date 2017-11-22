import { SharedModule } from './../../shared/shared.module';
import { VitrineService } from './../../provider/service/vitrine.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VitrineRoutingModule } from './vitrine.routing.module';
import { VitrineListaComponent } from './vitrine-lista/vitrine-lista.component';

import * as firebase from 'firebase';
import { VitrineComponent } from './vitrine.component';

@NgModule({
    imports: [
        CommonModule, 
        FormsModule,
        VitrineRoutingModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        VitrineListaComponent,
        VitrineComponent
    ],
    providers: [VitrineService]
})

export class VitrineModule {


}