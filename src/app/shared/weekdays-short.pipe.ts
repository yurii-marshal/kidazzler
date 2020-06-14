import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weekdaysShort',
})
export class WeekdaysShortPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.split(',').map(day => day.substr(0, 3)).join(', ');
  }

}

