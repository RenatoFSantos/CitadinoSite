import { AuthGuard } from './../../guards/auth-guards';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { VitrineListaComponent } from './vitrine-lista/vitrine-lista.component';
import { VitrineComponent } from './vitrine.component';

export const vitrines_route: Routes = [
    { path: '', component: VitrineComponent},
    { path: 'vitrine/lista', component: VitrineListaComponent},
    { path: 'vitrine/:idMunicipio/:idVitrine', component: VitrineComponent},
    { path: 'vitrine/:id', component: VitrineListaComponent}
]

@NgModule({
    imports: [
        RouterModule.forChild(vitrines_route)
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: []
})

export class VitrineRoutingModule {

}