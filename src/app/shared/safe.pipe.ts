import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {
  }

  transform(value: any, args?: any): any {
    switch (args) {
      case 'style':
        return this.domSanitizer.bypassSecurityTrustStyle(value);
        break;
      case 'backgroundImage':
        return this.domSanitizer.bypassSecurityTrustStyle(`url(${value})`);
        break;
      case 'url':
        return this.domSanitizer.bypassSecurityTrustUrl(value);
        break;
      case 'html':
        return this.domSanitizer.bypassSecurityTrustHtml(value);
        break;
      case 'resourceUrl':
        return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
        break;
      case 'script':
        return this.domSanitizer.bypassSecurityTrustScript(value);
        break;
      default:
        return this.domSanitizer.bypassSecurityTrustUrl(value);
    }
  }
}
