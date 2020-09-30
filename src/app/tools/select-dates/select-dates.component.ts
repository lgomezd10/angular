import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { dates } from '../dates';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-select-dates',
  templateUrl: './select-dates.component.html',
  styleUrls: ['./select-dates.component.css']
})
export class SelecciondatesComponent implements OnInit {

  desde: Date;
  hasta: Date;
  desdeString: string;
  hastaString: string;

  @Output()
  enviardates: EventEmitter<dates> = new EventEmitter<dates>();

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.desde = new Date();
    this.hasta = new Date();
    this.desdeString = "";
    this.hastaString = "";
  }
  
  onEnviar() {
    this.desde.setHours(0,0,0);
    this.hasta.setHours(23,59,59);
    if (this.desde > this.hasta) {
      alert("La segunda date debe ser igual o mayor");
    } else {
      this.desdeString = this.datePipe.transform(this.desde, 'yyyy-MM-dd HH:mm:ss');
      this.hastaString = this.datePipe.transform(this.hasta, 'yyyy-MM-dd HH:mm:ss');      
      let dates: dates = {
        desde: this.desdeString,
        hasta: this.hastaString
      }
      this.enviardates.emit(dates);
    }
  }

}
