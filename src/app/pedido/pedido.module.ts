import { ItemService } from './../provider/service/item.service';
import { PedidoService } from './../provider/service/pedido.service';
import { PedidoRoutingModule } from './pedido.routing.module';
import { PedidoEmpresaComponent } from './pedido-empresa/pedido-empresa.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import * as firebase from 'firebase';
import { PedidoProdutoComponent } from './pedido-produto/pedido-produto.component';
import { PedidoDeliveryComponent } from './pedido-delivery/pedido-delivery.component';
import { PedidoStatusComponent } from './pedido-status/pedido-status.component';

@NgModule({
    imports: [
        CommonModule, 
        FormsModule,
        PedidoRoutingModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        PedidoEmpresaComponent,
        PedidoProdutoComponent,
        PedidoDeliveryComponent,
        PedidoStatusComponent
    ],
    providers: [PedidoService]
})

export class PedidoModule {


}