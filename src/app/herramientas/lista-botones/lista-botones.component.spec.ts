import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaBotonesComponent } from './lista-botones.component';

describe('ListaBotonesComponent', () => {
  let component: ListaBotonesComponent;
  let fixture: ComponentFixture<ListaBotonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaBotonesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaBotonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
