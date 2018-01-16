import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import * as firebase from 'firebase';

import { CategoriaPSService } from './../../provider/service/categoria-ps.service';
import { CategoriaPsComponent } from 'app/cadastro/categoria-ps/categoria-ps.component';
import { CategoriaPsListaComponent } from './categoria-ps-lista/categoria-ps-lista.component';
import { CategoriaPSRoutingModule } from 'app/cadastro/categoria-ps/categoria-ps.routing.module';

@NgModule({
    imports: [
        CommonModule, 
        FormsModule,
        CategoriaPSRoutingModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        CategoriaPsComponent,
        CategoriaPsListaComponent
    ],
    providers: [CategoriaPSService]
})

export class CategoriaPSModule {


}