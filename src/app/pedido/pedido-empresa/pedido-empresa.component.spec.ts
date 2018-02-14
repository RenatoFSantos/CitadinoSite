import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoEmpresaComponent } from './pedido-empresa.component';

describe('PedidoEmpresaComponent', () => {
  let component: PedidoEmpresaComponent;
  let fixture: ComponentFixture<PedidoEmpresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoEmpresaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
