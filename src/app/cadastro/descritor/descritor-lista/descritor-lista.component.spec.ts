import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescritorListaComponent } from './descritor-lista.component';

describe('DescritorListaComponent', () => {
  let component: DescritorListaComponent;
  let fixture: ComponentFixture<DescritorListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescritorListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescritorListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
