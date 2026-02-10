
import { render, screen } from '@testing-library/angular';
import { NavSalesComponent } from './nav-sales.component';
import { TabsModule } from 'primeng/tabs';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach } from 'vitest';

// --- Unit/Logic Tests ---
import { TestBed } from '@angular/core/testing';

describe('NavSalesComponent', () => {
  let component: NavSalesComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavSalesComponent, TabsModule, FormsModule, ReactiveFormsModule, RouterOutlet, RouterLink]
    }).compileComponents();
    const fixture = TestBed.createComponent(NavSalesComponent);
    component = fixture.componentInstance;
  });

  it('should initialize with default tabs', () => {
    expect(component.tabs.length).toBe(2);
    expect(component.tabs[0].label).toBe('Caja');
    expect(component.tabs[1].label).toBe('Buscar ventas');
  });
});

// --- Render/Template Tests ---
describe('NavSalesComponent (template)', () => {
  it('should render tab labels', async () => {
    await render(NavSalesComponent, {
      imports: [TabsModule, FormsModule, ReactiveFormsModule, RouterOutlet, RouterLink],
    });
    expect(await screen.findByText((content) => content.includes('Caja'))).toBeTruthy();
    expect(await screen.findByText((content) => content.includes('Buscar ventas'))).toBeTruthy();
  });

  it('should render tabs with correct routes', async () => {
    await render(NavSalesComponent, {
      imports: [TabsModule, FormsModule, ReactiveFormsModule, RouterOutlet, RouterLink],
    });
    const cajaTab = await screen.findByText((content) => content.includes('Caja'));
    const buscarTab = await screen.findByText((content) => content.includes('Buscar ventas'));
    expect(cajaTab).toBeTruthy();
    expect(buscarTab).toBeTruthy();
  });

  it('should have accessible tab roles', async () => {
    await render(NavSalesComponent, {
      imports: [TabsModule, FormsModule, ReactiveFormsModule, RouterOutlet, RouterLink],
    });
    expect(screen.getByRole('tablist')).toBeTruthy();
    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(2);
  });
});
