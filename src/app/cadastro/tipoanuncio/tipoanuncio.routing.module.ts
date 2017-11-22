import { AuthGuard } from './../../guards/auth-guards';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { TipoAnuncioComponent } from './tipoanuncio.component';
import { TipoAnuncioListaComponent } from './tipoanuncio-lista/tipoanuncio-lista.component';

export const tipoanuncios_route: Routes = [
    { path: '', component: TipoAnuncioComponent},
    { path: 'tipoanuncio/lista', component: TipoAnuncioListaComponent},
    { path: 'tipoanuncio/novo', component: TipoAnuncioComponent},
    { path: 'tipoanuncio/:id', component: TipoAnuncioComponent}
]

@NgModule({
    imports: [
        RouterModule.forChild(tipoanuncios_route)
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: []
})

export class TipoAnuncioRoutingModule {

}