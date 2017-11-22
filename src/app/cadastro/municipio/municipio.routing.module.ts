import { AuthGuard } from './../../guards/auth-guards';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { MunicipioComponent } from './municipio.component';
import { MunicipioListaComponent } from './municipio-lista/municipio-lista.component';

export const municipios_route: Routes = [
    { path: '', component: MunicipioComponent},
    { path: 'municipio/lista', component: MunicipioListaComponent},
    { path: 'municipio/novo', component: MunicipioComponent},
    { path: 'municipio/:id', component: MunicipioComponent}
]

@NgModule({
    imports: [
        RouterModule.forChild(municipios_route)
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: []
})

export class MunicipioRoutingModule {

}