import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {

  transform(value: string, particle?: string): any {
    if (!particle) {
      return value;
    }
    const regexp = new RegExp(particle, 'g');
    return value.replace(regexp, '<b>' + particle + '</b>');
  }

}
