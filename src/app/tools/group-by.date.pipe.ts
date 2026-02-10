import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'groupBydate',
    standalone: true
})
export class GroupBydatePipe implements PipeTransform {

    constructor(private readonly datePipe: DatePipe){      
    }

  transform(value: Array<any>): Array<any> {
    if (!value || value.length === 0) {
      return [];
    }
    const groupedObj = value.reduce((prev, cur)=> {
       let date: Date = cur['date'];
       let dateString: string = this.datePipe.transform(date, 'dd-MM-yy') ?? '';
      if(prev[dateString]) {
        prev[dateString].push(cur);
      } else {
        prev[dateString] = [cur];
      }
      return prev;
    }, {});
    return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));
  }
}