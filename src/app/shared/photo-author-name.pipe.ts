import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'photoAuthorName',
})
export class PhotoAuthorNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      const nameArr = value.split(' ');
      return `${nameArr[0]} ${nameArr[1].charAt(1)}.`;
    }
    return;
  }

}
