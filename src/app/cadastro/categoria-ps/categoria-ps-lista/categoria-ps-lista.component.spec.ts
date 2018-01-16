import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaPsListaComponent } from './categoria-ps-lista.component';

describe('CategoriaPsListaComponent', () => {
  let component: CategoriaPsListaComponent;
  let fixture: ComponentFixture<CategoriaPsListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriaPsListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaPsListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
