import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerdidasComponent } from './perdidas.component';

describe('PerdidasComponent', () => {
  let component: PerdidasComponent;
  let fixture: ComponentFixture<PerdidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerdidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerdidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
