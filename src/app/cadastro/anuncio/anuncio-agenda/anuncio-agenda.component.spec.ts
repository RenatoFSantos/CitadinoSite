import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnuncioAgendaComponent } from './anuncio-agenda.component';

describe('AnuncioAgendaComponent', () => {
  let component: AnuncioAgendaComponent;
  let fixture: ComponentFixture<AnuncioAgendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnuncioAgendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnuncioAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
