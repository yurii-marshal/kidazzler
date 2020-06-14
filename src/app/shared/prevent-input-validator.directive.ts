import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, FormControl } from '@angular/forms';

@Directive({
  selector: '[preventInputValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PreventInputValidatorDirective, multi: true }],
})
export class PreventInputValidatorDirective {

  @Input() preventInputValidator: any;

  validate(control: FormControl) {
    if (this.preventInputValidator.maxlength && control.value.length > this.preventInputValidator.maxlength) {
      return `Maximum ${this.preventInputValidator.maxlength} symbols are allowed`;
    }

    return null;
  }
}
