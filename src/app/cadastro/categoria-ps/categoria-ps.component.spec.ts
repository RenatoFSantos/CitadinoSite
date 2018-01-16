import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaPsComponent } from './categoria-ps.component';

describe('CategoriaPsComponent', () => {
  let component: CategoriaPsComponent;
  let fixture: ComponentFixture<CategoriaPsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriaPsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaPsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
