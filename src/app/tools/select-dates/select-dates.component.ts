import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Dates } from '../dates';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-select-dates',
    templateUrl: './select-dates.component.html',
    styleUrls: ['./select-dates.component.css'],
    standalone: true,
    imports: [DatePickerModule, ReactiveFormsModule, FormsModule, ButtonModule],
    providers: [DatePipe]
})
export class SelectionDatesComponent implements OnInit {

  from: Date = new Date();
  to: Date = new Date();
  fromString: string = "";
  toString: string = "";

  @Output()
  enviardates: EventEmitter<Dates> = new EventEmitter<Dates>();

  constructor(private datePipe: DatePipe) { }


  ngOnInit() {
    this.from = new Date();
    this.to = new Date();
    this.fromString = "";
    this.toString = "";
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
        let fechas: Dates = {
          from: this.fromString,
          to: this.toString
        }
        this.enviardates.emit(fechas);
      }
    });
  }

}