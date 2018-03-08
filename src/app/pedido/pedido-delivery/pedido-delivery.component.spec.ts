import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoDeliveryComponent } from './pedido-delivery.component';

describe('PedidoDeliveryComponent', () => {
  let component: PedidoDeliveryComponent;
  let fixture: ComponentFixture<PedidoDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
