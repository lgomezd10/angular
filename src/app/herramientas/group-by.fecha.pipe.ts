import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({name: 'groupByFecha'})
export class GroupByFechaPipe implements PipeTransform {

    constructor(private datePipe: DatePipe){      
    }

  transform(value: Array<any>): Array<any> {    
    const groupedObj = value.reduce((prev, cur)=> {
       let fecha: Date = cur['fecha'];
       let fechaString: string = this.datePipe.transform(fecha, 'dd-MM-yy');
      if(!prev[fechaString]) {
        prev[fechaString] = [cur];
      } else {
        prev[fechaString].push(cur);
      }
      return prev;
    }, {});
    return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));
  }
}