import { Pipe, PipeTransform } from '@angular/core';

import { PhoneInfo } from '../core/shared/phone-info';

@Pipe({ name: 'phoneNumber' })
export class PhonePipe implements PipeTransform {
  constructor() {}

  transform(value: any, options?: PhoneInfo, ): string {
    if (!value) {
      return '';
    }

    if (!options) {
      return value;
    }

    if (value.startsWith('+')) {
      value = value.substr(2);
    }

    let replacementIndex = 0;
    return `+${options.code} ${options.mask.replace(/9/g, () => value[replacementIndex++])}`;
  }
}
