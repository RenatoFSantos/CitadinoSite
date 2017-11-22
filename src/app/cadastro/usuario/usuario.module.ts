import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from './../../provider/service/usuario.service';
import { EmpresaService } from './../../provider/service/empresa.service';
import { EnderecoService } from './../../provider/service/endereco.service';
import {  
  FormsModule, 
  ReactiveFormsModule
} from '@angular/forms';

import { UsuarioComponent } from './usuario.component';
import { UsuarioListaComponent } from './usuario-lista/usuario-lista.component';
import { UsuarioRoutingModule } from './usuario.routing.module';
import { EnderecoListaComponent } from './../endereco/endereco-lista/endereco-lista.component';
import { EnderecoComponent } from './../endereco/endereco.component';
import { UsuarioConfigComponent } from './usuario-config/usuario-config.component';

import * as firebase from 'firebase';

@NgModule({
    declarations: [
        UsuarioComponent,
        UsuarioListaComponent,
        EnderecoComponent,
        EnderecoListaComponent,
        UsuarioConfigComponent
    ],
    imports: [
        CommonModule, 
        FormsModule,
        UsuarioRoutingModule,
        SharedModule
    ],
    providers: [ UsuarioService, EmpresaService, EnderecoService ]
})

export class UsuarioModule {

}