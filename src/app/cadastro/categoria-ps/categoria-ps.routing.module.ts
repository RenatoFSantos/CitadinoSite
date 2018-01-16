import { AuthGuard } from './../../guards/auth-guards';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { CategoriaPsComponent } from 'app/cadastro/categoria-ps/categoria-ps.component';
import { CategoriaPsListaComponent } from './categoria-ps-lista/categoria-ps-lista.component';

export const categoriasps_route: Routes = [
    { path: '', component: CategoriaPsComponent},
    { path: 'categoriaps/lista', component: CategoriaPsListaComponent},
    { path: 'categoriaps/novo', component: CategoriaPsComponent},
    { path: 'categoriaps/:id', component: CategoriaPsComponent}
]

@NgModule({
    imports: [
        RouterModule.forChild(categoriasps_route)
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: []
})

export class CategoriaPSRoutingModule {

}