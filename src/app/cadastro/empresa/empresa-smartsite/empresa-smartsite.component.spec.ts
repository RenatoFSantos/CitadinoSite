import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaSmartsiteComponent } from './empresa-smartsite.component';

describe('EmpresaSmartsiteComponent', () => {
  let component: EmpresaSmartsiteComponent;
  let fixture: ComponentFixture<EmpresaSmartsiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpresaSmartsiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresaSmartsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
