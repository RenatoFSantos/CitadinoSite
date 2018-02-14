import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoProdutoComponent } from './pedido-produto.component';

describe('PedidoProdutoComponent', () => {
  let component: PedidoProdutoComponent;
  let fixture: ComponentFixture<PedidoProdutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoProdutoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
