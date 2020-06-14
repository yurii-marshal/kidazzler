import { AbstractControl, FormGroup } from '@angular/forms';
import { MESSAGES } from './error-messages';

export class FormErrors {
  private form: FormGroup;
  private submitted: boolean;

  constructor(form: FormGroup) {
    this.form = form;
  }

  checkControlValidation(controlName: string): boolean {
    const control: AbstractControl = this.form.get(controlName);
    return control.invalid && this.submitted;
  }

  checkControlOnTyping(controlName: string): boolean {
    const control: AbstractControl = this.form.get(controlName);
    return control.invalid && (control.dirty || this.submitted);
  }

  getMessage(key: string): string {
    return MESSAGES[key] || '';
  }

  getValidationMessage(controlName: string, showControlMessageIfEmpty: boolean = false): string {
    const control: AbstractControl = this.form.get(controlName);
    let message = '';
    if (control && control.errors) {
      Object.keys(control.errors).forEach(key => {
        if (MESSAGES[key]) {
          message = MESSAGES[key];
        }
      });
      if (!message && showControlMessageIfEmpty && MESSAGES[controlName]) {
        message = MESSAGES[controlName];
      }
    }
    return message;
  }

  setSubmitted() {
    this.submitted = true;
  }

  reset() {
    this.submitted = false;
  }
}
