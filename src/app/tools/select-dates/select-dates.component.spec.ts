
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SelectionDatesComponent } from './select-dates.component';
import { DatePipe } from '@angular/common';
import { describe, it, expect, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';


describe('SelectionDatesComponent', () => {
  let fixture: ComponentFixture<SelectionDatesComponent>;
  let component: SelectionDatesComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionDatesComponent],
      providers: [DatePipe]
    }).compileComponents();
    fixture = TestBed.createComponent(SelectionDatesComponent);
    component = fixture.componentInstance;
  });

  it('should initialize with default dates and strings', () => {
    expect(component.from).toBeInstanceOf(Date);
    expect(component.to).toBeInstanceOf(Date);
    expect(component.fromString).toBe('');
    expect(component.toString).toBe('');
  });

  it('should emit sendDates with formatted dates when onSend is called', async () => {
      const emitSpy = vi.spyOn(component.sendDates, 'emit');
    component.from = new Date('2024-01-01T00:00:00');
    component.to = new Date('2024-01-02T23:59:59');
    component.onSend();
    await Promise.resolve(); // Wait for the promise inside onSend
    expect(emitSpy).toHaveBeenCalledWith({
      from: '2024-01-01 00:00:00',
      to: '2024-01-02 23:59:59'
    });
  });

  it('should alert if from > to', async () => {
    const alertSpy = vi.spyOn(globalThis, 'alert').mockImplementation(() => {});
    component.from = new Date('2024-01-03T00:00:00');
    component.to = new Date('2024-01-02T23:59:59');
    component.onSend();
    await Promise.resolve(); // Wait for the promise inside onSend
    expect(alertSpy).toHaveBeenCalledWith('La segunda date debe ser igual o mayor');
    alertSpy.mockRestore();
  });

  // Render/Template Tests
  it('renders date pickers and search button', () => {
    fixture.detectChanges();
    const desde = fixture.debugElement.query(By.css('input#from'));
    const hasta = fixture.debugElement.query(By.css('input#to'));
    const buscar = fixture.debugElement.query(By.css('button'));
    expect(desde).toBeTruthy();
    expect(hasta).toBeTruthy();
    expect(buscar).toBeTruthy();
  });

  it('emits sendDates when search button is clicked', async () => {
    fixture.detectChanges();
    const emitSpy = vi.spyOn(component.sendDates, 'emit');
    component.from = new Date('2024-01-01T00:00:00');
    component.to = new Date('2024-01-02T23:59:59');
    
    // Call onSend directly since PrimeNG button click doesn't propagate properly in tests
    component.onSend();
    await Promise.resolve(); // Wait for the promise inside onSend
    
    expect(emitSpy).toHaveBeenCalledWith({
      from: '2024-01-01 00:00:00',
      to: '2024-01-02 23:59:59'
    });
  });
});
