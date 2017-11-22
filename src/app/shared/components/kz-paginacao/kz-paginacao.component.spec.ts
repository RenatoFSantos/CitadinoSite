import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KzPaginacaoComponent } from './kz-paginacao.component';

describe('KzPaginacaoComponent', () => {
  let component: KzPaginacaoComponent;
  let fixture: ComponentFixture<KzPaginacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KzPaginacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KzPaginacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
