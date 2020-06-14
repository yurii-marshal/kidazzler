import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[cMaxLength]',
})
export class MaxLengthDirective {

  @Input('cMaxLength') cMaxLength: any;

  constructor(private control: NgControl) {
  }

  @HostListener('keyup', ['$event']) onKeyup(event) {
    const element = event.target as HTMLInputElement;
    const limit = Number(this.cMaxLength);
    if (/(android)/i.test(navigator.userAgent)) {
      const value = element.value.substr(0, limit);
      if (value.length <= limit) {
        element.value = value;
      } else {
        element.value = value.substr(0, limit - 1);
        event.preventDefault();
      }
      this.control.control.setValue(element.value);
    }
  }

  @HostListener('focus', ['$event']) onFocus(event) {
    const element = event.target as HTMLInputElement;
    if (!/(android)/i.test(navigator.userAgent)) {
      element.setAttribute('maxlength', this.cMaxLength);
    }
  }
}
