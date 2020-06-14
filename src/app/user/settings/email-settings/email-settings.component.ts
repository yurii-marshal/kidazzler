import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { FormErrors } from '../../../core/shared/form-errors';
import { AppValidators } from '../../../core/shared/app-validators';
import { AccountService } from '../../../core/account.service';
import { UserService } from '../../../core/user.service';

@Component({
  templateUrl: './email-settings.component.html',
  styleUrls: ['../../user.scss'],
})
export class EmailSettingsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  formErrors: FormErrors;
  isLoading: Subscription;
  currentEmail: string;

  private profileSub: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private accountService: AccountService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.buildForm();

    this.profileSub = this.userService.getProfile().subscribe(profile => {
      this.currentEmail = profile.email;
      this.form.get('email').setValue(this.currentEmail);
    });
  }

  ngOnDestroy() {
    this.profileSub.unsubscribe();
    this.profileSub = null;
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [AppValidators.email, Validators.required]],
    });

    this.formErrors = new FormErrors(this.form);
  }

  onSubmit(): void {
    this.formErrors.setSubmitted();

    if (!this.form.valid || !this.form.dirty) {
      return;
    }

    this.isLoading = this.accountService
      .updateAccountInfo({ email: this.form.value.email })
      .subscribe(() => {
        this.form.get('email').setValue(this.currentEmail);
        this.toastr.success(
          'Please confirm e-mail change using the link sent to your old e-mail address',
        );
      });
  }
}
