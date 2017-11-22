import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitrineListaComponent } from './vitrine-lista.component';

describe('VitrineListaComponent', () => {
  let component: VitrineListaComponent;
  let fixture: ComponentFixture<VitrineListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitrineListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitrineListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
