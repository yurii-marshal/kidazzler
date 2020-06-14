import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AccountService } from '../../core/account.service';
import { FormErrors } from '../../core/shared/form-errors';
import { UserService } from '../../core/user.service';
import { ValidationService } from '../../core/validation.service';

@Component({
  selector: 'kz-phone-verification',
  templateUrl: './phone-verification.component.html',
  styleUrls: ['./phone-verification.component.scss', '../user.scss'],
  providers: [ValidationService],
})
export class PhoneVerificationComponent implements OnInit {

  form: FormGroup;
  phoneMask: string = '';
  formErrors: FormErrors;
  errMessage: string = '';

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router, private userService: UserService, private spinner: NgxUiLoaderService, private validationService: ValidationService, private route: ActivatedRoute) {
  }

  async ngOnInit() {
    this.spinner.start();
    this.phoneMask = await this.userService
      .getProfileSnapshot()
      .pipe(map(profile => {
        this.spinner.stop();
        return `+${profile.phoneCode} ${profile.phoneMask}`;
      }))
      .toPromise();
    this.form = this.fb.group({
      phone: ['', [Validators.required]],

    });
    this.formErrors = new FormErrors(this.form);
  }

  onPhoneFocus() {
    this.errMessage = '';
  }

  submit() {
    this.formErrors.setSubmitted();
    if (this.form.invalid) {
      return;
    }
    this.spinner.startLoader('send-verify-code');
    this.validationService.validatePhone(this.form.controls['phone'], 'user').pipe(
      switchMap((res) => {
        return res && res.invalid ? throwError(res.invalid) :
          this.accountService.updateAccountInfo({ phone: this.form.value.phone }).pipe(
            catchError(err => throwError(err)),
            switchMap(() => this.accountService.sendVerifyPhoneCode().pipe(catchError(err => throwError(err)))),
          );
      }),
      catchError((e) => throwError(e)),
    ).subscribe(() => {
      this.spinner.stopLoader('send-verify-code');
      this.router.navigate(['submit'], { relativeTo: this.route });
    }, (err) => {
      this.errMessage = err || err.message;
      this.spinner.stopLoader('send-verify-code');
    });


  }
}
