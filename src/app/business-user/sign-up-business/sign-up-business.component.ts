import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { FormErrors } from '../../core/shared/form-errors';
import { AppValidators } from '../../core/shared/app-validators';
import { SignupService } from '../../core/signup.service';

@Component({
  templateUrl: './sign-up-business.component.html',
  styleUrls: ['../business-user.scss']
})
export class SignUpBusinessComponent implements OnInit {
  userForm: FormGroup;
  formErrorsService: FormErrors;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private signupService: SignupService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    const email = localStorage.getItem('business-email') || '';

    this.userForm = this.fb.group({
      firstName: ['', [AppValidators.userName, Validators.required]],
      lastName: ['', [AppValidators.userName, Validators.required]],
      passwords: this.fb.group(
        {
          password: ['', [Validators.required, AppValidators.password]],
          passwordConfirmation: ['', Validators.required],
        },
        { validator: AppValidators.passwordConfirmation('password', 'passwordConfirmation') },
      ),
      email: [email, [Validators.required, AppValidators.email]],
    });

    if (email) {
      this.userForm.get('email').disable();
    }

    this.formErrorsService = new FormErrors(this.userForm);
  }

  onSubmit(): void {
    this.formErrorsService.setSubmitted();

    if (this.userForm.valid && !this.submitted) {
      this.submitted = true;
      const claimingToken = localStorage.getItem('business-claiming-token');
      const data: any = Object.assign({ claimingToken }, this.userForm.getRawValue());

      data.confirmationPassword = data.passwords.passwordConfirmation;
      data.password = data.passwords.password;
      delete data.passwords;

      data.country = localStorage.getItem('business-country') || 'US';

      this.signupService.businessSignup(data).subscribe(
        () => {
          localStorage.removeItem('business-country');

          // if (claimingToken) {
          //   this.router.navigate(['/claim-business', parseInt(localStorage.getItem('business-id'), 10)]);
          // } else {
          //   this.router.navigate(['businesses']);
          // }

          this.router.navigate(['/claim-business', parseInt(localStorage.getItem('business-id'), 10)]);

        },
        (response: HttpErrorResponse) => {
          this.submitted = false;

          let message = '';
          if ((response.status === 400 || response.status === 409) && response.error.message) {
            message = response.error.message;

            if (response.status === 409) {
              message = message.replace('sign in', '<a href="/login/business">sign in</a>');
            }
            this.toastr.error(message, null, { enableHtml: true });
          }
        },
      );
    }
  }
}
