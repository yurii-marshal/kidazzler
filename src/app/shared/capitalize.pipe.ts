import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return value;
    }
    let text = value;
    text = text.toLowerCase()
      .split(' ')
      .map((string) => string.charAt(0).toUpperCase() + string.substring(1))
      .join(' ');

    return text;
  }
}
