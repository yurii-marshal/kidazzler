import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AccountService } from '../../../core/account.service';
import { FormErrors } from '../../../core/shared/form-errors';
import { AppValidators } from '../../../core/shared/app-validators';
import { UserProfile } from '../../shared/user-profile.model';
import { UserService } from '../../../core/user.service';

@Component({
  templateUrl: './profile-settings.component.html',
  styleUrls: ['../../user.scss'],
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  formErrors: FormErrors;
  isLoading: Subscription;
  user: UserProfile;
  @ViewChild('avatar') avatarInputRef: ElementRef;

  private profileSub: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private accountService: AccountService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.profileSub = this.userService
      .getProfile()
      .subscribe(profile => this.form.patchValue(profile));
  }

  ngOnDestroy() {
    this.profileSub.unsubscribe();
    this.profileSub = null;
  }

  onSubmit(): void {
    this.formErrors.setSubmitted();

    if (!this.form.valid || !this.form.dirty) return;

    const data = this.form.value;

    this.isLoading = this.accountService.updateAccountInfo(data).subscribe(() => {
      this.formErrors.reset();
      this.form.reset(data);

      this.toastr.success('Your profile has been changed successfully.');
    });
  }

  async uploadAvatar() {
    const avatarInput = this.avatarInputRef.nativeElement;

    if (!avatarInput.files || !avatarInput.files[0]) return;

    const avatar: File = avatarInput.files[0];

    try {
      const imageUrl = await this.accountService.uploadAvatar(avatar);

      this.form.get('avatar').setValue(imageUrl);
      this.form.get('avatar').markAsDirty();
    } catch (response) {
      let message = 'Error uploading avatar';
      if (response instanceof HttpErrorResponse) {
        message = response.error.message;
      }

      avatarInput.value = '';

      this.toastr.error(message);
    }
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      firstName: ['', [AppValidators.userName, Validators.required]],
      lastName: ['', [AppValidators.userName, Validators.required]],
      avatar: [''],
      paypalEmail: [''],
      // venmoUsername: [''],
    });

    this.formErrors = new FormErrors(this.form);
  }
}
