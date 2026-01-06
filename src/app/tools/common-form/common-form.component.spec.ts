import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonFormComponent } from './common-form.component';

describe('CommonFormComponent', () => {
  let component: CommonFormComponent;
  let fixture: ComponentFixture<CommonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
