import { TestBed } from '@angular/core/testing';
import { ErrorService } from './error.service';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ErrorService', () => {
  let service: ErrorService;
  let routerMock: any;
  let socketMock: any;

  beforeEach(() => {
    routerMock = { navigate: vi.fn() };
    socketMock = {
      connectedSocket$: vi.fn(() => new BehaviorSubject(true).asObservable()),
      connectingSocket$: vi.fn(() => new BehaviorSubject(false).asObservable()),
      reset: vi.fn()
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: SocketService, useValue: socketMock }
      ]
    });
    service = TestBed.inject(ErrorService);
  });

  // Unit/Logic Tests
  it('should initialize BehaviorSubjects', () => {
    expect(service.mensaje$).toBeInstanceOf(BehaviorSubject);
    expect(service.mensaje404$).toBeInstanceOf(BehaviorSubject);
  });

  it('should show and reset error messages', () => {
    service.show('Test error');
    expect(service.mensaje$.getValue()).toBe('Test error');
    service.reset();
    expect(service.mensaje$.getValue()).toBe('');
    expect(service.mensaje404$.getValue()).toBe('');
  });

  it('should showError404 and getError404$', () => {
    service.showError404('404 error');
    expect(service.mensaje404$.getValue()).toBe('404 error');
    let value = '';
    service.getError404$().subscribe(v => value = v);
    expect(value).toBe('404 error');
  });

  it('should getError$ observable', () => {
    let value = '';
    service.show('observable error');
    service.getError$().subscribe(v => value = v);
    expect(value).toBe('observable error');
  });

  it('should call connectedSocket$ and connectingSocket$', () => {
    expect(service.connectedSocket$()).toBeTruthy();
    expect(service.connectingSocket$()).toBeTruthy();
  });

  it('should handle HttpErrorResponse in showErrorInApp', () => {
    const error = new HttpErrorResponse({ status: 404, error: { message: 'Sale not found' } });
    service.showErrorInApp(error);
    expect(service.mensaje404$.getValue()).toBe('No se ha entrado la venta');
  });

  it('should handle 401 HttpErrorResponse and navigate', () => {
    const error = new HttpErrorResponse({ status: 401, error: { message: 'Unauthorized' } });
    service.showErrorInApp(error);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle 409 HttpErrorResponse', () => {
    const error = new HttpErrorResponse({ status: 409, error: { message: 'Duplicated' } });
    service.showErrorInApp(error);
    expect(service.mensaje404$.getValue()).toBe('Registro duplicado');
  });

  it('should handle generic HttpErrorResponse', () => {
    const error = new HttpErrorResponse({ status: 500, error: { message: 'Server error' }, statusText: 'Internal Server Error' });
    service.showErrorInApp(error);
    expect(service.mensaje$.getValue()).toContain('Server-side error: 500');
  });

  it('should handle ErrorEvent', () => {
    const errorEvent = { error: { message: 'ErrorEvent' } };
    service.showErrorInApp(errorEvent as any);
    expect(service.mensaje$.getValue()).toContain('Ha ocurrido un error inesperado');
  });

  it('should handle unknown error', () => {
    service.showErrorInApp({});
    expect(service.mensaje$.getValue()).toContain('Ha ocurrido un error inesperado');
  });

  // Render/Template Tests (Behavior)
  it('should return correct error messages from getMessageError', () => {
    expect(service.getMessageError('Sale not found')).toBe('No se ha entrado la venta');
    expect(service.getMessageError('Product not found')).toBe('No se ha encontrado el producto');
    expect(service.getMessageError('Purchase not found')).toBe('No se ha encontrado la compra');
    expect(service.getMessageError('No sales found')).toBe('No se han encontrado ventas en las fechas indicadas');
    expect(service.getMessageError('No purchases found')).toBe('No se han encontrado compras en las fechas indicadas');
    expect(service.getMessageError('Otro error')).toBe('Otro error');
  });
});
