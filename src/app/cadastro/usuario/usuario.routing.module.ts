import { AuthGuard } from './../../guards/auth-guards';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { UsuarioComponent } from './usuario.component';
import { UsuarioListaComponent } from './usuario-lista/usuario-lista.component';
import { EnderecoComponent } from './../endereco/endereco.component';
import { EnderecoListaComponent } from './../endereco/endereco-lista/endereco-lista.component';
import { UsuarioConfigComponent } from './usuario-config/usuario-config.component';

export const usuarios_route: Routes = [
    { path: '', component: UsuarioComponent},
    { path: 'usuario/lista', component: UsuarioListaComponent},
    { path: 'usuario/novo', component: UsuarioComponent},
    { path: 'usuario/config', component: UsuarioConfigComponent},
    { path: 'usuario/:idusua/endereco', component: EnderecoListaComponent},
    { path: 'usuario/:idusua/endereco/novo', component: EnderecoComponent},
    { path: 'usuario/:idusua/endereco/:idend', component: EnderecoComponent},
    { path: 'usuario/:id', component: UsuarioComponent}
]

@NgModule({
    imports: [
        RouterModule.forChild(usuarios_route)
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: []
})

export class UsuarioRoutingModule {

}