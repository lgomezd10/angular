import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { dates } from '../dates';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-select-dates',
  templateUrl: './select-dates.component.html',
  styleUrls: ['./select-dates.component.css']
})
export class SelecciondatesComponent implements OnInit {

  from: Date;
  to: Date;
  fromString: string;
  toString: string;

  @Output()
  enviardates: EventEmitter<dates> = new EventEmitter<dates>();

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.from = new Date();
    this.to = new Date();
    this.fromString = "";
    this.toString = "";
  }
  
  onEnviar() {
    this.from.setHours(0,0,0);
    this.to.setHours(23,59,59);
    if (this.from > this.to) {
      alert("La segunda date debe ser igual o mayor");
    } else {
      this.fromString = this.datePipe.transform(this.from, 'yyyy-MM-dd HH:mm:ss');
      this.toString = this.datePipe.transform(this.to, 'yyyy-MM-dd HH:mm:ss');      
      let dates: dates = {
        from: this.fromString,
        to: this.toString
      }
      this.enviardates.emit(dates);
    }
  }

}
