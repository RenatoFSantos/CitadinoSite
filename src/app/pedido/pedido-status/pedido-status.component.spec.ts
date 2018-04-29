import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoStatusComponent } from './pedido-status.component';

describe('PedidoStatusComponent', () => {
  let component: PedidoStatusComponent;
  let fixture: ComponentFixture<PedidoStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
