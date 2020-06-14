import { Directive, Input, OnInit } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

import { BaseFormFieldComponent } from './form-field/form-field.component';

@Directive({
  selector: '[kzForm]',
})
export class KzFormDirective implements OnInit {
  @Input() scrollOnError = false;

  get submitted(): boolean {
    return this.formDirective.submitted;
  }

  private fields: BaseFormFieldComponent[] = [];

  constructor(private formDirective: FormGroupDirective) {}

  registerField(field: BaseFormFieldComponent) {
    this.fields.push(field);
  }

  ngOnInit() {
    this.formDirective.ngSubmit.subscribe(() => {
      if (!this.formDirective.form.invalid || !this.scrollOnError) return;

      const failedFields = this.fields.filter(field => field.shouldShowError);

      if (!failedFields.length) return;

      failedFields[0].scrollIntoView();
    });
  }
}
