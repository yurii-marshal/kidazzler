import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AccountService } from '../../core/account.service';
import { AppValidators } from '../../core/shared/app-validators';
import { FormErrors } from '../../core/shared/form-errors';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../public.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  formGroup: FormGroup;
  isLoading: boolean;
  isSent: boolean;
  isBusiness: boolean;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private toastr: ToastrService,
    private _activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.isBusiness = this._activatedRoute.snapshot.paramMap.get('isBusiness') ? true : false;
    this.buildForm();
  }

  onSubmit(): void {
    if (!this.formGroup.valid || !this.formGroup.dirty) {
      return;
    }
    const email = this.formGroup.get('email').value;

    this.isLoading = true;
    this.accountService.resetPassword(email, this.isBusiness).subscribe(
      () => {
        this.isLoading = false;
        this.isSent = true;
      },
      (response: HttpErrorResponse) => {
        this.isLoading = false;
        if (response.status >= 400 && response.status < 500) {
          this.toastr.error(response.error.message);
        }
      },
    );
  }

  private buildForm(): void {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, AppValidators.email]],
    });
  }
}
