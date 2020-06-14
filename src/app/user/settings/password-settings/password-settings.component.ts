import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AccountService } from '../../../core/account.service';
import { FormErrors } from '../../../core/shared/form-errors';
import { AppValidators } from '../../../core/shared/app-validators';

@Component({
  templateUrl: './password-settings.component.html',
  styleUrls: ['../../user.scss'],
})
export class PasswordSettingsComponent implements OnInit {
  form: FormGroup;
  formErrorsService: FormErrors;
  token: string;
  isLoading: Subscription;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      passwords: this.fb.group(
        {
          currentPassword: ['', [Validators.required, AppValidators.currentPassword]],
          password: ['', [Validators.required, AppValidators.password]],
          confirmationPassword: ['', [Validators.required]],
        },
        { validator: AppValidators.passwordConfirmation('password', 'confirmationPassword') },
      ),
    });

    this.formErrorsService = new FormErrors(this.form);
  }

  onSubmit(): void {
    this.formErrorsService.setSubmitted();

    if (this.form.valid && this.form.dirty) {
      const data = {
        oldPassword: this.form.get('passwords.currentPassword').value,
        newPassword: this.form.get('passwords.password').value,
      };

      this.isLoading = this.accountService.changePassword(data).subscribe(() => {
        this.toastr.success('Your password has been changed successfully');
        this.onReset();
      });
    }
  }

  onReset(): void {
    this.form.reset();
    this.formErrorsService.reset();
  }
}
