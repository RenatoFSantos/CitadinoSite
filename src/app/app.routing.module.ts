import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, CanActivateChild } from '@angular/router';

import { SiteComponent } from './site/site.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth-guards';
import { UsuarioGuards } from './guards/usuario-guards';
import { ContratoComponent } from './contrato/contrato.component';
import { HomeComponent } from './home/home.component';

const app_routes: Routes = [
    { path: '', component: SiteComponent},
    { path: 'usuario', loadChildren: 'app/cadastro/usuario/usuario.module#UsuarioModule', canActivate: [AuthGuard], canActivateChild: [UsuarioGuards]},
    { path: 'empresa', loadChildren: 'app/cadastro/empresa/empresa.module#EmpresaModule', canActivate: [AuthGuard]},
    { path: 'categoria', loadChildren: 'app/cadastro/categoria/categoria.module#CategoriaModule', canActivate: [AuthGuard]},
    { path: 'descritor', loadChildren: 'app/cadastro/descritor/descritor.module#DescritorModule', canActivate: [AuthGuard]},
    { path: 'plano', loadChildren: 'app/cadastro/plano/plano.module#PlanoModule', canActivate: [AuthGuard]},
    { path: 'municipio', loadChildren: 'app/cadastro/municipio/municipio.module#MunicipioModule', canActivate: [AuthGuard]},
    { path: 'tipoanuncio', loadChildren: 'app/cadastro/tipoanuncio/tipoanuncio.module#TipoAnuncioModule', canActivate: [AuthGuard]},
    { path: 'anuncio', loadChildren: 'app/cadastro/anuncio/anuncio.module#AnuncioModule', canActivate: [AuthGuard]},
    { path: 'agenda', loadChildren: 'app/cadastro/agenda/agenda.module#AgendaModule', canActivate: [AuthGuard]},
    { path: 'vitrine', loadChildren: 'app/cadastro/vitrine/vitrine.module#VitrineModule', canActivate: [AuthGuard]},
    { path: 'contrato', component: ContratoComponent},
    { path: 'login', component: LoginComponent},
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]}
]

@NgModule({
    imports: [
        RouterModule.forRoot(app_routes)
    ],
    exports: [
        RouterModule
    ]

})
export class AppRoutingModule {

}