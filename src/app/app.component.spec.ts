import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LogoComponent } from './logo/logo.component';
import { ShowErrorsComponent } from './errores/show-errors/show-errors.component';
import { it, expect, beforeEach, describe } from 'vitest';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, LogoComponent, ShowErrorsComponent]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'tpv-fruteria'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('TU TIENDA DE ALIMENTACION');
  });

  it('should render logo title in LogoComponent', () => {
    const fixture = TestBed.createComponent(LogoComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const h1 = compiled.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1.textContent).toContain('Nombre de tu tienda');
  });
});