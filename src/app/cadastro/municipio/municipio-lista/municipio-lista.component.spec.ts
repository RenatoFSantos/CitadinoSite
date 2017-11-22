import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MunicipioListaComponent } from './municipio-lista.component';

describe('MunicipioListaComponent', () => {
  let component: MunicipioListaComponent;
  let fixture: ComponentFixture<MunicipioListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MunicipioListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MunicipioListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
