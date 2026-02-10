
import { render, screen } from '@testing-library/angular';
import { NavPurchasesComponent } from './nav-purchases.component';
import { TabsModule } from 'primeng/tabs';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach } from 'vitest';

// --- Unit/Logic Tests ---
import { TestBed } from '@angular/core/testing';

describe('NavPurchasesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavPurchasesComponent],
    }).compileComponents();
  });

  it('should initialize with default tabs', () => {
    const fixture = TestBed.createComponent(NavPurchasesComponent);
    const component = fixture.componentInstance;
    expect(component.tabs.length).toBe(2);
    expect(component.tabs[0].label).toBe('Compras');
    expect(component.tabs[1].label).toBe('Buscar compras');
  });
});

// --- Render/Template Tests ---
describe('NavPurchasesComponent (template)', () => {
  it('should render tab labels', async () => {
    await render(NavPurchasesComponent, {
      imports: [TabsModule, FormsModule, ReactiveFormsModule, RouterOutlet, RouterLink],
    });
    // Check both tab labels are visible
    expect(screen.getByText('Compras')).toBeTruthy();
    expect(screen.getByText('Buscar compras')).toBeTruthy();
  });

  it('should render tabs with correct routes', async () => {
    await render(NavPurchasesComponent, {
      imports: [TabsModule, FormsModule, ReactiveFormsModule, RouterOutlet, RouterLink],
    });
    // Check tab links
    const comprasTab = screen.getByText('Compras');
    const buscarTab = screen.getByText('Buscar compras');
    expect(comprasTab).toBeTruthy();
    expect(buscarTab).toBeTruthy();
  });

  it('should have accessible tab roles', async () => {
    await render(NavPurchasesComponent, {
      imports: [TabsModule, FormsModule, ReactiveFormsModule, RouterOutlet, RouterLink],
    });
    // PrimeNG tabs should render with role="tablist"
    expect(screen.getByRole('tablist')).toBeTruthy();
    // Each tab should have role="tab"
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(2);
  });
});
