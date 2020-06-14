import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumberForCall',
})
export class PhoneNumberForCallPipe implements PipeTransform {

  transform(value: any, options?: any): any {
    if (!value) {
      return '';
    }

    if (!options) {
      return value;
    }

    const mask = '999-999-9999';

    let replacementIndex = 0;
    return `${options.code}-${mask.replace(/9/g, () => value[replacementIndex++])}`.replace(/\(\)/, '-');
  }

}
