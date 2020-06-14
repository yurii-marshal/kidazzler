import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FormErrors } from '../../core/shared/form-errors';
import { AppValidators } from '../../core/shared/app-validators';
import { SignupService } from '../../core/signup.service';
import { FacebookService } from '../../core/facebook.service';
import { Country } from '../../core/shared/country.model';

@Component({
  templateUrl: './page-additional-info.component.html',
  styleUrls: ['../parent.scss']
})
export class PageAdditionalInfoComponent implements OnInit {
  form: FormGroup;
  isOrganization = false;
  formErrors: FormErrors;
  countries: Observable<Country[]>;
  submitted: boolean;

  private countriesQuery = new BehaviorSubject<string>('');
  private readonly DEFAULT_COUNTRY_CODE: string = 'US';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private signupService: SignupService,
    private facebookService: FacebookService,
  ) {}

  ngOnInit() {
    this.buildForm();

    this.countries = this.countriesQuery.pipe(
      switchMap(query => this.signupService.searchCountries(query)),
    );
  }

  toggleOrganization(value: boolean): void {
    this.isOrganization = value;
    this.form
      .get('representedOrganization')
      .setValidators(this.isOrganization ? [AppValidators.required] : null);
    this.form.get('representedOrganization').updateValueAndValidity();
  }

  searchCountries(query?: string) {
    this.countriesQuery.next(query);
  }

  async onSubmit() {
    this.formErrors.setSubmitted();

    if (!this.form.valid || this.submitted) return;

    this.submitted = true;

    const data: any = Object.assign({}, this.form.value);

    if (!this.isOrganization) {
      delete data.representedOrganization;
    }

    try {
      await this.facebookService.signUp(data);
    } catch (response) {
      this.submitted = false;
    }
  }

  private buildForm() {
    const schema = {
      email: ['', [Validators.required, AppValidators.email]],
      country: [this.DEFAULT_COUNTRY_CODE, [Validators.required]],
    };
    const missingFields = this.facebookService.getStoredMissingFields();

    const formConfig = { representedOrganization: [''] };
    for (const field of missingFields) {
      if (schema[field]) {
        formConfig[field] = schema[field];
      }
    }

    this.form = this.fb.group(formConfig);
    this.formErrors = new FormErrors(this.form);
  }
}
