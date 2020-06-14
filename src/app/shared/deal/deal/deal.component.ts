import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BusinessService } from '../../../core/business.service';

import { Deal } from '../../../core/shared/deal.model';
import { FormErrors } from '../../../core/shared/form-errors';
import { untilComponentDestroyed } from '../../componentDestroyed';

@Component({
  selector: 'kz-deal',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DealComponent implements OnInit, OnDestroy {
  form: FormGroup;
  formErrors: FormErrors;

  expiresOptions = [{ label: 'Never Expires', value: false }, { label: 'Expires', value: true }];
  paymentType = '';
  isExpire = false;
  deal: Deal = {};
  showDeletePopup = false;
  showCategoriesPopup = false;
  startDate: Date = new Date(new Date().setHours(23, 59, 0, 0));
  currency = [
    { label: '$ (USD)', value: 'usd' },
    { label: '$ (CAD)', value: 'cad' },
  ];

  // TODO: REMOVE AFTER API CONNECTION
  categories = [];

  selectedCategories = [];

  @Output() onSubmit = new EventEmitter();
  @Output() onDelete = new EventEmitter();

  constructor(private fb: FormBuilder, private location: Location, private route: ActivatedRoute, private spinner: NgxUiLoaderService, private businessService: BusinessService) {
  }

  ngOnInit() {
    const dealId = +this.route.snapshot.paramMap.get('dealId');
    const businessId = +this.route.snapshot.paramMap.get('id');
    this.spinner.start();
    this.businessService.getEventCategories()
      .pipe(untilComponentDestroyed(this))
      .subscribe(eventCategories => {
        this.categories = eventCategories.items;
      });
    if (dealId) {
      this.businessService
        .getDeal(businessId, dealId)
        .pipe(untilComponentDestroyed(this))
        .subscribe(
          (deal: Deal) => {
            this.deal = deal;
            this.selectedCategories = this.deal.eventCategories;
            this.buildForm();
          },
          () => {
          },
          () => {
            this.spinner.stop();
          },
        );
    } else {
      this.spinner.stop();
      this.buildForm();

    }
  }

  onExpireTypeChange(): void {
    this.isExpire ? this.form.controls['expireAt'].setValidators(Validators.required) : this.form.controls['expireAt'].clearValidators();
    this.form.controls['expireAt'].updateValueAndValidity();
  }

  buildForm(): void {
    const controlConfig = {
      title: [this.deal.title || '', [Validators.required]],
      city: [this.deal.city || '', [Validators.required]],
      state: [this.deal.state || '', [Validators.required]],
      description: [this.deal.description || ''],
      eventCategories: [this.deal.eventCategories || '', [Validators.required]],
      expireAt: [this.deal.expireAt || null],
      code: [this.deal.code || '', [Validators.required]],
      price: [this.deal.price || 0],
      currency: [this.deal.currency || 'usd'],
      discount: [this.deal.discount || null],
    };

    this.form = this.fb.group(controlConfig);
    this.formErrors = new FormErrors(this.form);
    if (!+this.deal.expireAt) {
      this.isExpire = false;
    }

    if (!+this.deal.price) {
      this.paymentType = 'free';
    } else {
      this.paymentType = 'fixed';
    }

    this.onExpireTypeChange();
  }

  onPaymentTypeChange(type) {
    console.log(type);
    if (type === 'free') {
      this.form.get('price').setValue(null);
      this.form.get('discount').setValue(null);
    } else if (type === 'discount') {
      this.form.get('price').setValue(null);
    } else {
      this.form.get('discount').setValue(null);
    }
  }

  onDiscountChange(value) {
    if (value < 1) {
      this.form.controls['discount'].patchValue(null);
    }
    if (value > 100) {
      this.form.controls['discount'].patchValue(100);
    }
  }

  onCategoriesSubmit() {
    this.showCategoriesPopup = false;
  }

  cancel() {
    this.location.back();
  }

  deleteDeal() {
    this.showDeletePopup = true;
  }

  onDeleteDeal() {
    this.onDelete.emit();
  }

  submit(): void {
    this.formErrors.setSubmitted();
    if (this.selectedCategories.length) {
      this.form.controls['eventCategories'].setValue(this.selectedCategories.map(category => category.id));
    }
    if (this.form.invalid) {
      setTimeout(() => this.scrollToError());
      return;
    }

    this.onSubmit.emit(this.form.value);
  }

  updateSelectedCategories(category) {
    if (!this.isSelectedCategory(category.id)) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories.splice(this.selectedCategories.findIndex(selectedCategory => selectedCategory.id === category.id), 1);
    }
  }

  isSelectedCategory(id): boolean {
    return this.selectedCategories.findIndex(selectedCategory => selectedCategory.id === id) > -1;
  }

  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  scrollToError(): void {
    const firstElementWithError = document.getElementsByClassName('error-message')[0];
    this.scrollTo(firstElementWithError);
  }

  ngOnDestroy(): void {
  }

}
