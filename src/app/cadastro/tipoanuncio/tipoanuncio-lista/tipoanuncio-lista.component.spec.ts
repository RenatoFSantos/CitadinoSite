import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoAnuncioListaComponent } from './tipoanuncio-lista.component';

describe('TipoanuncioListaComponent', () => {
  let component: TipoAnuncioListaComponent;
  let fixture: ComponentFixture<TipoAnuncioListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoAnuncioListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoAnuncioListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
