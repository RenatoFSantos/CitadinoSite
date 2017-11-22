import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanoListaComponent } from './plano-lista.component';

describe('PlanoListaComponent', () => {
  let component: PlanoListaComponent;
  let fixture: ComponentFixture<PlanoListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanoListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
