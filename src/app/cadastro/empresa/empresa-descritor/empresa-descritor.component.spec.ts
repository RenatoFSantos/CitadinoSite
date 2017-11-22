import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaDescritorComponent } from './empresa-descritor.component';

describe('EmpresaDescritorComponent', () => {
  let component: EmpresaDescritorComponent;
  let fixture: ComponentFixture<EmpresaDescritorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpresaDescritorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaDescritorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
