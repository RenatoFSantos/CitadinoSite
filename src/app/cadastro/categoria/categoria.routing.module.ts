import { AuthGuard } from './../../guards/auth-guards';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { CategoriaComponent } from './categoria.component';
import { CategoriaListaComponent } from './categoria-lista/categoria-lista.component';

export const categorias_route: Routes = [
    { path: '', component: CategoriaComponent},
    { path: 'categoria/lista', component: CategoriaListaComponent},
    { path: 'categoria/novo', component: CategoriaComponent},
    { path: 'categoria/:id', component: CategoriaComponent}
]

@NgModule({
    imports: [
        RouterModule.forChild(categorias_route)
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: []
})

export class CategoriaRoutingModule {

}