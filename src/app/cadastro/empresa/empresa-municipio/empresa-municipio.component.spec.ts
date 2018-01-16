import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaMunicipioComponent } from './empresa-municipio.component';

describe('EmpresaMunicipioComponent', () => {
  let component: EmpresaMunicipioComponent;
  let fixture: ComponentFixture<EmpresaMunicipioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpresaMunicipioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaMunicipioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
