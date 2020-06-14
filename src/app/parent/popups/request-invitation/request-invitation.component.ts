import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { SignupService } from '../../../core/signup.service';
import { AppValidators } from '../../../core/shared/app-validators';

@Component({
  templateUrl: './request-invitation.component.html',
  styleUrls: ['../../parent.scss']
})
export class RequestInvitationComponent implements OnInit {
  form: FormGroup;
  invitationSent: boolean;

  private submitting: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private signupService: SignupService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, AppValidators.email]],
    });
  }

  async sendInvite() {
    if (!this.form.valid || this.submitting) return;

    this.submitting = true;

    try {
      await this.signupService.requestInvitation(this.form.value.email);
      this.invitationSent = true;
    } catch (response) {
      let message;
      if (response.error.errorType === 'MaxInvitationsCountError') {
        message = 'You exceeded the limit of invitations that can be sent to this email';
      } else if (response.error && response.error.message) {
        message = response.error.message;
      }

      this.toastr.error(message);

      this.submitting = false;
    }
  }

  onHide(): void {
    this.closeDialog();
  }

  closeDialog(): void {
    this.router.navigate([{ outlets: { popup: null } }]);
  }
}
