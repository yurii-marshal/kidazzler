import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[kzNoWhitespace]',
})

export class NoWhitespaceDirective {
  @Input() onlyStart: boolean = false;

  constructor(private element: ElementRef<HTMLInputElement>) {
  }

  @HostListener('input', ['$event'])
  onInput(event) {
    const newValue = this.element.nativeElement.value.trim();
    if (newValue && this.onlyStart) {
      return this.element.nativeElement.value;
    } else if (!this.onlyStart) {
      this.element.nativeElement.value = newValue;

      if (!newValue) {
        event.preventDefault();
        event.stopPropagation();

        return false;
      }
    } else {
      this.element.nativeElement.value = newValue;
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

  }
}
