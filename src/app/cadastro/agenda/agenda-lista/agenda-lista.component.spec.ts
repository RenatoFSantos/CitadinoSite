import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaListaComponent } from './agenda-lista.component';

describe('AgendaListaComponent', () => {
  let component: AgendaListaComponent;
  let fixture: ComponentFixture<AgendaListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
