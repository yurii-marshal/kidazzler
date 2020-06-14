import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'AMPM',
})
export class AmpmPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }

    const H = +value.substr(0, 2);
    const h = H % 12 || 12;
    const ampm = H < 12 ? ' AM' : ' PM';

    return h + value.substr(2, 3) + ampm;
  }
}
