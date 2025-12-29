import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { dates } from '../dates';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-select-dates',
    templateUrl: './select-dates.component.html',
    styleUrls: ['./select-dates.component.css'],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatDatepickerToggle, MatDatepicker, ReactiveFormsModule, FormsModule],
    providers: [DatePipe]
})
export class SelectionDatesComponent implements OnInit {

  from: Date = new Date();
  to: Date = new Date();
  fromString: string = "";
  toString: string = "";

  @Output()
  enviardates: EventEmitter<dates> = new EventEmitter<dates>();

  constructor(private datePipe: DatePipe, private cdr: ChangeDetectorRef) { }


  ngOnInit() {
    this.from = new Date();
    this.to = new Date();
    this.fromString = "";
    this.toString = "";
    this.cdr.detectChanges();
  }
  
  onSend() {
    // Usar Promise.resolve().then() para asegurar que los valores de ngModel estén actualizados
    Promise.resolve().then(() => {
      this.from.setHours(0,0,0);
      this.to.setHours(23,59,59);
      if (this.from > this.to) {
        alert("La segunda date debe ser igual o mayor");
      } else {
        this.fromString = this.datePipe.transform(this.from, 'yyyy-MM-dd HH:mm:ss');
        this.toString = this.datePipe.transform(this.to, 'yyyy-MM-dd HH:mm:ss');      
        let fechas: dates = {
          from: this.fromString,
          to: this.toString
        }
        this.enviardates.emit(fechas);
        this.cdr.markForCheck();
      }
    });
  }

}