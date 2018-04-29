import { PedidoStatusComponent } from './pedido-status/pedido-status.component';
import { PedidoEmpresaComponent } from './pedido-empresa/pedido-empresa.component';
import { AuthGuard } from './../guards/auth-guards';
import { Routes, RouterModule, CanDeactivate } from '@angular/router';
import { NgModule } from '@angular/core';
import { PedidoProdutoComponent } from './pedido-produto/pedido-produto.component';
import { PedidoDeliveryComponent } from './pedido-delivery/pedido-delivery.component';

export const pedido_routes: Routes = [
    { path: 'pedidoempresa/:id', component: PedidoProdutoComponent},
    { path: 'pedidoempresa', component: PedidoEmpresaComponent},
    { path: 'pedidodelivery/:id', component: PedidoDeliveryComponent},
    { path: 'pedidostatus', component: PedidoStatusComponent}
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