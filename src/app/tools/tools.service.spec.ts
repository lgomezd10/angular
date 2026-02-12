import { TestBed } from '@angular/core/testing';
import { ToolsService } from './tools.service';
import { ErrorService } from '../errores/error.service';
import { ButtonType } from './button-type';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ToolsService', () => {
  let service: ToolsService;
  let errorServiceMock: any;

  beforeEach(() => {
    errorServiceMock = { reset: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: ErrorService, useValue: errorServiceMock },
        ToolsService
      ]
    });
    service = TestBed.inject(ToolsService);
  });

  // Unit/Logic Tests
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should cleanShowErrorsComponent call errorService.reset', () => {
    service.cleanShowErrorsComponent();
    expect(errorServiceMock.reset).toHaveBeenCalled();
  });

  it('should set and get button types', () => {
    const buttons: ButtonType[] = [
      { id: 'btn1', name: 'Botón 1', show: true, focused: false },
      { id: 'btn2', name: 'Botón 2', show: true, focused: true }
    ];
    service.setButtonTypes(buttons);
    expect(service.getButtonTypes()).toEqual(buttons);
  });

  it('should create, add, delete and push button types', () => {
    const btn: ButtonType = { id: 'btn1', name: 'Botón 1', show: true, focused: false };
    service.crearButtonTypees([btn]);
    expect(service.getButtonTypes()).toEqual([btn]);
    service.newButtonType({ id: 'btn2', name: 'Botón 2', show: true, focused: true });
    expect(service.getButtonTypes().length).toBe(2);
    service.deleteButtonType(btn);
    expect(service.getButtonTypes().length).toBe(1);
    service.pushButtonType('btn2');
    service.getPulsado$().subscribe(val => {
      expect(val).toBe('btn2');
    });
  });

  it('should return getButtonTypes$ observable', () => {
    let value: ButtonType[] = [];
    service.setButtonTypes([{ id: 'btn1', name: 'Botón 1', show: true, focused: false }]);
    service.getButtonTypes$().subscribe(v => value = v);
    expect(value.length).toBe(1);
  });
});
