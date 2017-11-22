import { AuthGuard } from './../../guards/auth-guards';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { EmpresaComponent } from './empresa.component';
import { EmpresaListaComponent } from './empresa-lista/empresa-lista.component';
import { EmpresaDescritorComponent } from './empresa-descritor/empresa-descritor.component';
import { SmartsiteComponent } from './empresa-smartsite/empresa-smartsite.component';

export const empresas_route: Routes = [
    { path: '', component: EmpresaComponent},
    { path: 'empresa/lista', component: EmpresaListaComponent},
    { path: 'empresa/novo', component: EmpresaComponent},
    { path: 'empresa/:id/descritor', component: EmpresaDescritorComponent},
    { path: 'empresa/:id/smartsite', component: SmartsiteComponent},
    { path: 'empresa/:id', component: EmpresaComponent}
]

@NgModule({
    imports: [
        RouterModule.forChild(empresas_route)
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: []
})

export class EmpresaRoutingModule {

}