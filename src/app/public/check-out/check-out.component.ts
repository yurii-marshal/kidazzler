import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CreditCardValidator } from 'angular-cc-library';

import { PaymentService } from '../../core/payment.service';
import { UserService } from '../../core/user.service';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';
import { UserProfile } from '../../user/shared/user-profile.model';

@Component({
  selector: 'kz-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss'],
})
export class CheckOutComponent implements OnInit, OnDestroy {
  type: number;
  opened = false;
  form: FormGroup;
  profile: UserProfile;
  submitted = false;
  plans: any;
  selectedPlan: any;

  constructor(private fb: FormBuilder, private userService: UserService, private paymentService: PaymentService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.plans = [
      { id: 1, period: 'Annual', price: 29.99, regularPrice: 59.99, billed: 'Annually' },
      { id: 2, period: '6 Months', price: 24.99, regularPrice: 54.99, billed: 'Every 6 Months' },
      { id: 3, period: 'Monthly', price: 19.99, regularPrice: 49.99, billed: 'Monthly' },
    ];
    this.userService.getProfile().pipe(untilComponentDestroyed(this)).subscribe(profile => (this.profile = profile));
    this.buildForm();
    this.type = +this.route.snapshot.params['type'];
    this.selectedPlan = this.plans.find(el => el.id === this.type);
    console.log(this.selectedPlan);
  }

  buildForm() {
    const formControls = {
      name: ['', [Validators.maxLength(80)]],
      number: [null, [CreditCardValidator.validateCCNumber]],
      expirationDate: ['', [CreditCardValidator.validateExpDate]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      country: ['', []],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required]],
      address: ['', [Validators.required]],
      address2: [''],
    };

    this.form = this.fb.group(formControls);
  }


  toggleBlock() {
    this.opened = !this.opened;
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.paymentService.pay(this.form.value).subscribe();
  }

  ngOnDestroy() {

  }

}
