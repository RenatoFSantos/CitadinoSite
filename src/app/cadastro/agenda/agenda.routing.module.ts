import { AuthGuard } from './../../guards/auth-guards';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { NgModule } from '@angular/core';

import { AgendaComponent } from './agenda.component';
import { AgendaListaComponent } from './agenda-lista/agenda-lista.component';

export const agendas_route: Routes = [
    { path: '', component: AgendaComponent},
    { path: 'agenda/lista', component: AgendaListaComponent},
    { path: 'agenda/novo', component: AgendaComponent},
    { path: 'agenda/:id', component: AgendaComponent}
]

@NgModule({
    imports: [
        RouterModule.forChild(agendas_route)
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: []
})

export class AgendaRoutingModule {

}