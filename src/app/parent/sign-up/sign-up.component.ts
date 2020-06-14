import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AppValidators } from '../../core/shared/app-validators';
import { UserProfile } from '../../user/shared/user-profile.model';
import { SignupService } from '../../core/signup.service';
import { Country } from '../../core/shared/country.model';
import {
  FacebookAnalyticsEvent,
  FacebookAnalyticsService,
} from '../../core/analytics/facebook-analytics.service';

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['../parent.scss'],
})
export class SignUpComponent implements OnInit {
  user: UserProfile;
  userForm: FormGroup;
  isOrganization = false;
  submitted = false;
  countries: Observable<Country[]>;

  private countriesQuery = new BehaviorSubject<string>('');

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private signupService: SignupService,
    private analyticsService: FacebookAnalyticsService,
  ) {}

  ngOnInit() {
    this.analyticsService.track(FacebookAnalyticsEvent.PageView);

    this.countries = this.countriesQuery.pipe(
      switchMap(query => this.signupService.searchCountries(query)),
    );

    this.buildForm();
  }

  buildForm(): void {
    this.userForm = this.formBuilder.group({
      firstName: ['', [AppValidators.userName, AppValidators.required]],
      lastName: ['', [AppValidators.userName, AppValidators.required]],
      passwords: this.formBuilder.group(
        {
          password: ['', [AppValidators.required, AppValidators.password]],
          confirmationPassword: ['', AppValidators.required],
        },
        {
          validator: AppValidators.passwordConfirmation('password', 'confirmationPassword'),
        },
      ),
      email: ['', [AppValidators.required, AppValidators.email]],
      country: ['', [AppValidators.required]],
      representedOrganization: [''],
    });
  }

  toggleOrganization(value: boolean): void {
    this.isOrganization = value;
    this.userForm
      .get('representedOrganization')
      .setValidators(this.isOrganization ? [AppValidators.required] : null);
    this.userForm.get('representedOrganization').updateValueAndValidity();
  }

  onSubmit(): void {
    if (!this.userForm.valid || this.submitted) return;

    this.submitted = true;

    const data: any = Object.assign({}, this.userForm.value);

    data.confirmationPassword = data.passwords.confirmationPassword;
    data.password = data.passwords.password;
    delete data.passwords;

    this.signupService.signup(data).subscribe(
      () => {
        this.toastr.success(`Registration completed successfully`);
        this.router.navigate(['/successful-signup']);
      },
      (response: HttpErrorResponse) => {
        this.submitted = false;

        let message = '';
        if ((response.status === 400 || response.status === 409) && response.error.message) {
          message = response.error.message;

          if (response.status === 409) {
            message = message.replace('sign in', '<a href="/login">sign in</a>');
          }

          this.toastr.error(message, null, { enableHtml: true });
        }
      },
    );
  }

  searchCountries(query?: string) {
    this.countriesQuery.next(query);
  }
}
