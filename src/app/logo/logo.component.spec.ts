
import { render, screen } from '@testing-library/angular';
import { LogoComponent } from './logo.component';
import { MessageModule } from 'primeng/message';
import { describe, it, expect, beforeEach } from 'vitest';

// --- Unit/Logic Tests ---
import { TestBed } from '@angular/core/testing';

describe('LogoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageModule, LogoComponent],
    }).compileComponents();
  });

  it('should initialize with default nombre', () => {
    const fixture = TestBed.createComponent(LogoComponent);
    const component = fixture.componentInstance;
    expect(component.nombre).toBe('Nombre de tu tienda');
  });
});

// --- Render/Template Tests ---
describe('LogoComponent (template)', () => {
  it('should render the store name in h1', async () => {
    await render(LogoComponent, {
      imports: [MessageModule]
    });
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe('Nombre de tu tienda');
  });

  it('should have correct classes for layout', async () => {
    await render(LogoComponent, {
      imports: [MessageModule]
    });
    const container = screen.getByRole('heading', { level: 1 }).parentElement?.parentElement;
    expect(container?.className).toContain('w-full');
  });
});
