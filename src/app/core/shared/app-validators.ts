import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export class AppValidators {
  /* tslint:disable-next-line:max-line-length */
  static readonly EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  static email(control: AbstractControl): ValidationErrors | null {
    if (!control.value || AppValidators.EMAIL_PATTERN.test(control.value)) {
      return null;
    }

    return { email: true };
  }

  static password(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const password = control.value;

    if (!/^[ -~]+$/.test(password)) return { passwordAllowedCharacters: true };

    if (![/[0-9]+/, /[a-z]+/, /[A-Z]+/].every(rule => rule.test(password)) || password.length < 8) {
      return { passwordComplexity: true };
    }

    if (password.length > 128) return { passwordMaxLength: true };

    return null;
  }

  static passwordConfirmation(passwordKey: string, passwordConfirmationKey: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: boolean } | null => {
      const password = group.get(passwordKey);
      const confirmation = group.get(passwordConfirmationKey);

      if (password.invalid || confirmation.invalid) return null;

      if (password.value !== confirmation.value) {
        return { passwordConfirmation: true };
      }

      return null;
    };
  }

  static currentPassword(control: AbstractControl): ValidationErrors | null {
    if (AppValidators.password(control)) return { currentPassword: true };

    return null;
  }

  static userName(control: AbstractControl): ValidationErrors | null {
    if (!control.value || control.value.match(/^[a-z \-'’]+$/i)) {
      return null;
    }

    return { userName: true };
  }

  static required(control: AbstractControl): ValidationErrors | null {
    if (control.value && typeof control.value === 'string' && control.value.trim().length === 0) {
      return { required: true };
    }

    return Validators.required(control);
  }
}
