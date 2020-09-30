import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({name: 'groupBydate'})
export class GroupBydatePipe implements PipeTransform {

    constructor(private datePipe: DatePipe){      
    }

  transform(value: Array<any>): Array<any> {    
    const groupedObj = value.reduce((prev, cur)=> {
       let date: Date = cur['date'];
       let dateString: string = this.datePipe.transform(date, 'dd-MM-yy');
      if(!prev[dateString]) {
        prev[dateString] = [cur];
      } else {
        prev[dateString].push(cur);
      }
      return prev;
    }, {});
    return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));
  }
}