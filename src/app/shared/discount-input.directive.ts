import { Directive, ElementRef, HostListener, EventEmitter } from '@angular/core';

@Directive({
  selector: '[kzDiscountInput]',
  outputs: ['kzDiscountInput'],
})
export class DiscountInputDirective {
  kzDiscountInput: EventEmitter<string> = new EventEmitter<string>();

  constructor(private element: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event) {
    let transformedValue;
    const value = this.element.nativeElement.value.trim();

    if (value.length && +value <= 1) {
      transformedValue = '1';
    }

    if (+value > 100) {
      transformedValue = '100';
    }

    if ((this.isDotInValue(value) || isNaN(+value)) && value.length > 1) {
      transformedValue = value.substr(0, value.length - 1);
    }
    if ((this.isDotInValue(value) || isNaN(+value)) && value.length === 1) {
      transformedValue = '1';
    }

    if (!transformedValue) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    } else {
      this.kzDiscountInput.emit(transformedValue);
    }
  }

  isDotInValue(value: string): boolean {
    return !!value.split('').find(l => l === '.');
  }
}
