import { render, screen, fireEvent } from '@testing-library/angular';
import { describe, it, expect, beforeEach } from 'vitest';
import { EventEmitter } from '@angular/core';
import { ButtonListComponent } from './button-list.component';
import { ButtonType } from '../button-type';

describe('ButtonListComponent', () => {
  const defaultButtons: ButtonType[] = [
    { id: 'btn1', name: 'Botón 1', show: true, focused: false },
    { id: 'btn2', name: 'Botón 2', show: true, focused: true },
    { id: 'btn3', name: 'Botón 3', show: false, focused: false }
  ];

  // Unit/Logic Tests
  it('should render with default button list', async () => {
    await render(ButtonListComponent, {
      componentProperties: { lista: defaultButtons }
    });
    expect(screen.getByText('Botón 1')).toBeTruthy();
    expect(screen.getByText('Botón 2')).toBeTruthy();
    expect(screen.queryByText('Botón 3')).toBeNull();
  });

  it('should emit sendButtonType when onSend is called', async () => {
    const sendButtonType = new EventEmitter<string>();
    const emitSpy = vi.spyOn(sendButtonType, 'emit');
    const { fixture } = await render(ButtonListComponent, {
      componentProperties: { lista: defaultButtons, sendButtonType }
    });
    const component = fixture.componentInstance;
    component.onSend('btn1');
    expect(emitSpy).toHaveBeenCalledWith('btn1');
  });

  it('should change focus with ArrowRight/ArrowLeft keys', async () => {
    const { fixture } = await render(ButtonListComponent, {
      componentProperties: { lista: [...defaultButtons] }
    });
    const component = fixture.componentInstance;
    // Simula ArrowRight
    component.processKeydown({ code: 'ArrowRight', preventDefault: vi.fn() } as any, 'btn1');
    expect(component.lista.find(b => b.id === 'btn2')?.focused).toBe(true);
    // Simula ArrowLeft
    component.processKeydown({ code: 'ArrowLeft', preventDefault: vi.fn() } as any, 'btn2');
    expect(component.lista.find(b => b.id === 'btn1')?.focused).toBe(true);
  });

  // Render/Template Tests
  it('renders all visible buttons', async () => {
    await render(ButtonListComponent, {
      componentProperties: { lista: defaultButtons }
    });
    expect(screen.getByText('Botón 1')).toBeTruthy();
    expect(screen.getByText('Botón 2')).toBeTruthy();
    expect(screen.queryByText('Botón 3')).toBeNull();
  });

  it('emits sendButtonType when button is clicked', async () => {
    const sendButtonType = new EventEmitter<string>();
    const emitSpy = vi.spyOn(sendButtonType, 'emit');
    await render(ButtonListComponent, {
      componentProperties: { lista: defaultButtons, sendButtonType }
    });
    const button = screen.getByText('Botón 1');
    fireEvent.click(button);
    expect(emitSpy).toHaveBeenCalledWith('btn1');
  });
});
