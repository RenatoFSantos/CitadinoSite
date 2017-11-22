import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescritorComponent } from './descritor.component';

describe('DescritorComponent', () => {
  let component: DescritorComponent;
  let fixture: ComponentFixture<DescritorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescritorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescritorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
