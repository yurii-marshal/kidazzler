import { Pipe, PipeTransform } from '@angular/core';

const COUNTRIES = {
  'United States': 'US',
  'Canada': 'CA',
};

@Pipe({
  name: 'shortenCountry',
})
export class ShortenCountryPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    if (COUNTRIES[value]) {
      return COUNTRIES[value];
    }

    return value;
  }

}
