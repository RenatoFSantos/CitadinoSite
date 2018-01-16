import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EmpresaComponent } from './empresa.component';
import { EmpresaRoutingModule } from './empresa.routing.module';

import * as firebase from 'firebase';
import { EmpresaListaComponent } from './empresa-lista/empresa-lista.component';
import { CategoriaService } from './../../provider/service/categoria.service';
import { PlanoService } from './../../provider/service/plano.service';
import { EmpresaService } from './../../provider/service/empresa.service';
import { SmartsiteService } from './../../provider/service/smartsite.service';
import { EmpresaDescritorComponent } from './empresa-descritor/empresa-descritor.component';
import { SmartsiteComponent } from './empresa-smartsite/empresa-smartsite.component';
import { TabelaPrecoComponent } from './tabela-preco/tabela-preco.component';
import { TabelaPrecoService } from 'app/provider/service/tabela-preco.service';
import { EmpresaMunicipioComponent } from './empresa-municipio/empresa-municipio.component';

@NgModule({
    imports: [
        CommonModule, 
        FormsModule,
        EmpresaRoutingModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        EmpresaComponent,
        EmpresaListaComponent,
        EmpresaDescritorComponent,
        SmartsiteComponent,
        TabelaPrecoComponent,
        EmpresaMunicipioComponent
    ],
    providers: [EmpresaService, CategoriaService, PlanoService, SmartsiteService, TabelaPrecoService]
})

export class EmpresaModule {


}