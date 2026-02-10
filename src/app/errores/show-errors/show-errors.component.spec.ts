

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ShowErrorsComponent } from './show-errors.component';
import { ErrorService } from '../error.service';
import { AuthService } from '../../auth/auth.service';
import { MessageModule } from 'primeng/message';
import { BehaviorSubject } from 'rxjs';
import { vi, describe, it, beforeEach, expect } from 'vitest';

describe('ShowErrorsComponent', () => {
  let errores$: BehaviorSubject<string>;
  let errores404$: BehaviorSubject<string>;
  let connected$: BehaviorSubject<boolean>;
  let connecting$: BehaviorSubject<boolean>;
  let isLoged$: BehaviorSubject<boolean>;
  let mockErrorService: any;
  let mockAuthService: any;
  let fixture: ComponentFixture<ShowErrorsComponent>;
  let component: ShowErrorsComponent;

  beforeEach(async () => {
    errores$ = new BehaviorSubject('');
    errores404$ = new BehaviorSubject('');
    connected$ = new BehaviorSubject(true);
    connecting$ = new BehaviorSubject(false);
    isLoged$ = new BehaviorSubject(false);

    mockErrorService = {
      getError$: () => errores$.asObservable(),
      getError404$: () => errores404$.asObservable(),
      connectedSocket$: () => connected$.asObservable(),
      connectingSocket$: () => connecting$.asObservable(),
      reset: vi.fn()
    };
    mockAuthService = {
      isLoged: () => isLoged$.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [ShowErrorsComponent, MessageModule],
      providers: [
        { provide: ErrorService, useValue: mockErrorService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowErrorsComponent);
    component = fixture.componentInstance;
    component.typeError = 'Errors';
    vi.clearAllMocks();
  });




  // --- Unit/Logic Tests ---
  it('should initialize with default values', () => {
    fixture.detectChanges();
    expect(component.erroresValue).toBe('');
    expect(component.errores404Value).toBe('');
    expect(component.withoutConexion).toBe(false);
    expect(component.conecting).toBe(false);
    expect(component.isLoged).toBe(false);
    expect(component.typeError).toBe('Errors');
  });


  it('should update erroresValue and errores404Value from observables', async () => {
    await TestBed.runInInjectionContext(async () => {
      errores$.next('Error general');
      errores404$.next('Error 404');
      await fixture.whenStable();
      expect(component.erroresValue).toBe('Error general');
      expect(component.errores404Value).toBe('Error 404');
    });
  });


  it('should set withoutConexion and conecting when disconnected', () => {
    connected$.next(false);
    expect(component.withoutConexion).toBe(true);
    expect(component.conecting).toBe(true);
    expect(mockErrorService.reset).toHaveBeenCalled();
  });


  it('should set conecting from connectingSocket$', () => {
    connecting$.next(true);
    expect(component.conecting).toBe(true);
  });


  it('should reset errors when user logs in', () => {
    isLoged$.next(true);
    fixture.detectChanges();
    expect(component.isLoged).toBe(true);
    expect(mockErrorService.reset).toHaveBeenCalled();
  });

  // --- Render/Template Tests ---
  it('should show connecting message when conecting is true', () => {
    connecting$.next(true);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    console.log('Rendered HTML:', fixture.nativeElement.innerHTML);
    expect(compiled.textContent).toMatch(/Conectando con el servidor/i);
  });

  it('should show without connection message when withoutConexion is true and no erroresValue', () => {
    connected$.next(false);
    errores$.next('');
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toMatch(/Sin conexión con el servidor/i);
  });

  it('should show general error message when erroresValue is set', () => {
    errores$.next('Error general');
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Error general');
  });

  it('should show 404 error message when typeError is Error404 and errores404Value is set', () => {
    component.typeError = 'Error404';
    errores404$.next('No encontrado');
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No encontrado');
  });
});
