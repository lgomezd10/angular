
import { render, screen } from '@testing-library/angular';
import { PerdidasComponent } from './perdidas.component';
import { describe, it, expect, beforeEach } from 'vitest';

// --- Unit/Logic Tests ---
import { TestBed } from '@angular/core/testing';

describe('PerdidasComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerdidasComponent]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(PerdidasComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});

// --- Render/Template Tests ---
describe('PerdidasComponent (template)', () => {
  it('should render the default text', async () => {
    await render(PerdidasComponent);
    expect(screen.getByText(/perdidas works!/i)).toBeTruthy();
  });
});
