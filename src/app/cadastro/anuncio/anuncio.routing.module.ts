import { AuthGuard } from './../../guards/auth-guards';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { AnuncioComponent } from './anuncio.component';
import { AnuncioListaComponent } from './anuncio-lista/anuncio-lista.component';
import { AnuncioAgendaComponent } from './anuncio-agenda/anuncio-agenda.component';

export const anuncios_route: Routes = [
    { path: '', component: AnuncioComponent},
    { path: 'anuncio/lista', component: AnuncioListaComponent},
    { path: 'anuncio/novo', component: AnuncioComponent},
    { path: 'anuncio/:id/agenda', component: AnuncioAgendaComponent},
    { path: 'anuncio/:id', component: AnuncioComponent}
]

@NgModule({
    imports: [
        RouterModule.forChild(anuncios_route)
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: []
})

export class AnuncioRoutingModule {

}