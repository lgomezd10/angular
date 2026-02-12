import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { describe, it, expect, beforeEach } from 'vitest';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';

describe('LoginComponent', () => {
  let authServiceMock: any;

  beforeEach(() => {
    authServiceMock = {
      login: vi.fn(() => ({ subscribe: vi.fn(({ next, error }) => next?.(true)) }))
    };
  });

  // Unit/Logic Tests
  it('should initialize formGroup and state', async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    }).compileComponents();
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    expect(component.formGroup).toBeTruthy();
    expect(component.hide).toBe(true);
    expect(component.authErrorMessage).toBe('');
  });

  it('should call authService.login on valid form', async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    }).compileComponents();
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.formGroup.setValue({ username: 'usuario1', password: 'password1' });
    component.onLogin();
    expect(authServiceMock.login).toHaveBeenCalledWith({ username: 'usuario1', password: 'password1' });
  });

  it('should set authErrorMessage on login error', async () => {
    authServiceMock.login = vi.fn(() => ({ subscribe: vi.fn(({ next, error }) => error?.('error')) }));
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    }).compileComponents();
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.formGroup.setValue({ username: 'usuario1', password: 'password1' });
    component.onLogin();
    expect(component.authErrorMessage).toBe('El usuario o la contraseña no son válidos');
  });

  // Render/Template Tests
  it('renders main content and login form', async () => {
    await render(LoginComponent, {
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    });
    const loginElements = screen.getAllByText('Login');
    expect(loginElements.length).toBeGreaterThanOrEqual(2);
    loginElements.forEach(el => expect(el).toBeTruthy());
    expect(screen.getByLabelText('Usuario:')).toBeTruthy();
    expect(screen.getByLabelText('Contraseña:')).toBeTruthy();
  });

  it('shows error message when authErrorMessage is set', async () => {
    await render(LoginComponent, {
      componentProperties: { authErrorMessage: 'El usuario o la contraseña no son válidos' },
      providers: [{ provide: AuthService, useValue: authServiceMock }]
    });
    expect(screen.getByText('El usuario o la contraseña no son válidos')).toBeTruthy();
  });
});
