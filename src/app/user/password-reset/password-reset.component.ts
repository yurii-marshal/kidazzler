import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AppValidators } from '../../core/shared/app-validators';
import { FormErrors } from '../../core/shared/form-errors';
import { AccountService } from '../../core/account.service';

@Component({
  templateUrl: './password-reset.component.html',
  styleUrls: ['../user.scss'],
})
export class PasswordResetComponent implements OnInit {
  isLoading: Subscription;
  token: string;
  isChanged = false;
  form: FormGroup;
  formErrors: FormErrors;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.queryParams['token'];

    this.buildForm();
  }

  onSubmit(): void {
    this.formErrors.setSubmitted();

    if (this.form.valid && this.form.dirty) {
      const data = Object.assign({ token: this.token }, this.form.get('passwords').value);

      this.isLoading = this.accountService.restorePassword(data).subscribe(
        () => {
          this.isChanged = true;
        },
        (response: HttpErrorResponse) => {
          if (response.status === 400) {
            this.toastr.error(response.error.message);
          }
        },
      );
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      passwords: this.fb.group(
        {
          password: ['', [Validators.required, AppValidators.password]],
          confirmationPassword: ['', [Validators.required]],
        },
        { validator: AppValidators.passwordConfirmation('password', 'confirmationPassword') },
      ),
    });

    this.formErrors = new FormErrors(this.form);
  }
}
