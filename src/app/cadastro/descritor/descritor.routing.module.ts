import { AuthGuard } from './../../guards/auth-guards';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { DescritorComponent } from './descritor.component';
import { DescritorListaComponent } from './descritor-lista/descritor-lista.component';

export const descritors_route: Routes = [
    { path: '', component: DescritorComponent},
    { path: 'descritor/lista', component: DescritorListaComponent},
    { path: 'descritor/novo', component: DescritorComponent},
    { path: 'descritor/:id', component: DescritorComponent}
]

@NgModule({
    imports: [
        RouterModule.forChild(descritors_route)
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: []
})

export class DescritorRoutingModule {

}