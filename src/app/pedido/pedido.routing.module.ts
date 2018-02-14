import { PedidoEmpresaComponent } from './pedido-empresa/pedido-empresa.component';
import { AuthGuard } from './../guards/auth-guards';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { NgModule } from '@angular/core';
import { PedidoProdutoComponent } from 'app/pedido/pedido-produto/pedido-produto.component';

export const pedido_routes: Routes = [
    { path: 'pedidoempresa/:id', component: PedidoProdutoComponent},
    { path: 'pedidoempresa', component: PedidoEmpresaComponent}
]

@NgModule({
    imports: [
        RouterModule.forChild(pedido_routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: []
})

export class PedidoRoutingModule {

}