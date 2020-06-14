import { ElementRef, Directive } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[nameTransformation]',
  host: {
    '(input)': 'setTransformedValue($event)',
  },
})
export class NameTransformation {
  constructor(private ref: ElementRef, private control: NgControl) {}

  setTransformedValue($event) {
    const val = $event.target.value;
    if (val[0] && val[0] !== val.charAt(0).toUpperCase()) {
      const newVal = val.charAt(0).toUpperCase() + val.slice(1);
      this.ref.nativeElement.value = newVal;
      this.control.control.setValue(newVal);
    }
  }
}
