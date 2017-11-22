import { AuthGuard } from './../../guards/auth-guards';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { PlanoComponent } from './plano.component';
import { PlanoListaComponent } from './plano-lista/plano-lista.component';

export const planos_route: Routes = [
    { path: '', component: PlanoComponent},
    { path: 'plano/lista', component: PlanoListaComponent},
    { path: 'plano/novo', component: PlanoComponent},
    { path: 'plano/:id', component: PlanoComponent}
]

@NgModule({
    imports: [
        RouterModule.forChild(planos_route)
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: []
})

export class PlanoRoutingModule {

}