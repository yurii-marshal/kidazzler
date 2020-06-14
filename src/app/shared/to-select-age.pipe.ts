import { Pipe, PipeTransform } from '@angular/core';
import { Age } from '../core/shared/age';

@Pipe({
  name: 'toSelectAge',
})
export class ToSelectAgePipe implements PipeTransform {

  transform(ages: Age[], args?: any): any {
    if (!ages) {
      return undefined;
    }
    return ages.map(p => ({ label: p.ageFrom + (p.ageTo !== 1000 ? '-' + p.ageTo : '+'), value: { ageFrom: p.ageFrom, ageTo: p.ageTo } }));
  }

}

