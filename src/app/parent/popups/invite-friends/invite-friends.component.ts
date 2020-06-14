import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../../environments/environment';
import { AccountService } from '../../../core/account.service';
import { FacebookService } from '../../../core/facebook.service';
import { AppValidators } from '../../../core/shared/app-validators';

@Component({
  templateUrl: './invite-friends.component.html',
  styleUrls: ['../../parent.scss']
})
export class InviteFriendsComponent implements OnInit {
  referralSignupUrl = '';
  inviteesInput: FormControl;
  isLoading: boolean;
  inviteSentMessage: string;
  errorMessage: string;

  private submitted: boolean;

  constructor(
    private toastr: ToastrService,
    private facebookService: FacebookService,
    private accountService: AccountService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.inviteesInput = new FormControl(null, [
      Validators.required,
      Validators.maxLength(10),
      // emails unique
      (control: AbstractControl) => {
        if (!control.value) return null;

        const duplicatesIndices = [];

        for (let i = 1; i < control.value.length; i++) {
          if (
            control.value
              .slice(0, i)
              .some(email => email.toLowerCase() === control.value[i].toLowerCase())
          ) {
            duplicatesIndices.push(i);
          }
        }

        if (duplicatesIndices.length) {
          return {
            uniqueItems: {
              indices: duplicatesIndices,
              message: 'Email already in the list',
            },
          };
        }

        return null;
      },
      // emails valid
      (control: AbstractControl) => {
        if (!control.value) return null;

        const invalidItems = control.value.filter(item => !AppValidators.EMAIL_PATTERN.test(item));

        if (invalidItems.length) {
          return {
            validItems: {
              items: invalidItems,
              message: `Email isn't valid. Please, enter correct email.`,
            },
          };
        }

        return null;
      },
    ]);

    this.inviteesInput.valueChanges.subscribe(() => this.setError());

    this.referralSignupUrl = await this.accountService.getReferralSignupUrl();
  }

  copyToBuffer(element): void {
    element.select();
    let isCopied = false;
    try {
      isCopied = document.execCommand('copy');
    } catch (err) {
      isCopied = false;
    }
    if (isCopied) {
      this.toastr.success('Invite link is copied.');
    } else {
      this.toastr.info(
        'Your browser forbids to copy a link into the buffer. Please copy link manually.',
      );
    }
  }

  onFacebookInvite() {
    this.facebookService.postToWall(this.referralSignupUrl);
  }

  onTwitterInvite(): void {
    const text: string = encodeURIComponent(this.referralSignupUrl);
    const twtLink = `${environment.twitterPost}${text}`;
    window.open(twtLink, '_blank');
  }

  async sendInvite() {
    this.inviteSentMessage = '';
    this.submitted = true;

    if (!this.inviteesInput.valid) {
      this.setError();

      return;
    }

    this.isLoading = true;

    try {
      await this.accountService.invite(this.inviteesInput.value);

      this.isLoading = false;
      this.inviteSentMessage =
        this.inviteesInput.value.length > 1 ? 'Invites were sent' : 'Invite was sent';

      this.submitted = false;
      this.inviteesInput.setValue(null);
    } catch (response) {
      this.isLoading = false;

      if (!response.error || !response.error.errorType) return;

      let errors;
      if (response.error.errorType === 'MaxInvitationsCountError') {
        errors = {
          invitationsCount: {
            cache: true,
            items: response.error.context,
            message:
              'You exceeded the limit of invitations that can be sent to this email. Please use invitation link above.',
          },
        };
      } else if (response.error.errorType === 'EmailInUseError') {
        errors = {
          emailInUse: {
            cache: true,
            items: response.error.context,
            message: response.error.message,
          },
        };
      }

      this.inviteesInput.setErrors({ ...this.inviteesInput.errors, ...errors });
    }
  }

  onHide(): void {
    this.closeDialog();
  }

  closeDialog(): void {
    this.router.navigate([{ outlets: { popup: null } }]);
  }

  private setError() {
    this.errorMessage = null;

    if (!this.submitted || this.inviteesInput.valid) return;

    if (this.inviteesInput.getError('required'))
      this.errorMessage = 'At least one email is required';

    if (this.inviteesInput.getError('maxlength'))
      this.errorMessage = 'You can not send more than 10 e-mails at a time';
  }
}
