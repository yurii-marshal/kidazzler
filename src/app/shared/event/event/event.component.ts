import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BusinessPortalService } from '../../../core/business-portal.service';
import { BusinessService } from '../../../core/business.service';
import { BusinessEvent } from '../../../core/shared/business-event';
import { FormErrors } from '../../../core/shared/form-errors';
import { Location } from '@angular/common';
import { untilComponentDestroyed } from '../../componentDestroyed';

@Component({
  selector: 'kz-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit, OnDestroy {
  form: FormGroup;
  formErrors: FormErrors;
  eventId: number;
  event: BusinessEvent = {};
  timeStart: any;
  timeEnd: any;
  businessId: number;
  locationOptions = [{ label: 'Physical', value: 'Physical' }, { label: 'Online', value: 'Online' }];
  eventOptions = [{ label: 'One Time', value: 'Onetime' }, { label: 'Recurring', value: 'Recurring' }];
  recurringType: string = 'Daily';
  showCategoriesPopup = false;
  startDate: Date = new Date();
  currency = [
    { label: '$ (USD)', value: 'usd' },
    { label: '$ (CAD)', value: 'cad' },
  ];
  days = [{ value: 'monday', label: 'MON' }, { value: 'tuesday', label: 'TUE' }, { value: 'wednesday', label: 'WED' },
    { value: 'thursday', label: 'THU' }, { value: 'friday', label: 'FRI' }, { value: 'saturday', label: 'SAT' },
    { value: 'sunday', label: 'SUN' }];
  paymentType: string;
  byTime: boolean = false;
  showDeletePopup: boolean = false;
  @Output() onSubmit = new EventEmitter();
  @Output() onDeleteEvent = new EventEmitter();

  selectedCategories = [];
  categories: [];

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private businessPortalService: BusinessPortalService,
              private location: Location,
              private businessService: BusinessService,
              private spinner: NgxUiLoaderService) {
  }

  ngOnInit() {
    this.eventId = +this.route.snapshot.paramMap.get('eventId');
    this.businessId = +this.route.snapshot.paramMap.get('id');
    this.spinner.start();
    this.businessService.getEventCategories()
      .pipe(untilComponentDestroyed(this))
      .subscribe(eventCategories => {
        this.categories = eventCategories.items;
      });
    if (this.eventId) {
      this.businessService
        .getEvent(this.businessId, this.eventId)
        .pipe(untilComponentDestroyed(this))
        .subscribe(
          (event: BusinessEvent) => {
            this.event = event;
            this.selectedCategories = this.event.eventCategories;
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

  buildForm(): void {
    if (this.event.timeType === 'Daily' || this.event.timeType === 'Weekly') {
      this.recurringType = this.event.timeType;
      this.event.timeType = 'Recurring';
    } else {
      this.event.timeType = 'Onetime';
    }

    if (this.event.start || this.event.end) {
      this.timeStart = new Date(this.event.start) || '';
      this.timeEnd = new Date(this.event.end) || '';
    }

    const controlsConfig = {
      title: [this.event.title || '', [Validators.required, Validators.maxLength(80)]],
      description: [this.event.description || '', Validators.maxLength(4000)],
      eventCategories: [this.event.eventCategories || '', [Validators.required]],
      price: [this.event.price || 0, [Validators.required]],
      currency: [this.event.currency || 'usd'],
      priceDetails: [this.event.priceDetails || ''],
      website: [this.event.website || '', Validators.pattern('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)')],
      allDay: [this.event.allDay || false],
      timeType: [this.event.timeType || 'Onetime'],
      locationType: [this.event.locationType || 'Physical'],
      address: [this.event.address || '', Validators.required],
      city: [this.event.city || '', Validators.required],
      state: [this.event.state || '', Validators.required],
      zip: [this.event.zip || '', [Validators.required]],
      weekdays: [this.event.weekdays || ''],
      start: [this.event.start ? new Date(this.event.start) : this.startDate],
      end: [this.event.end ? new Date(this.event.end) : null],
      discountedPrice: [this.event.discountedPrice || ''],
    };
    this.form = this.fb.group(controlsConfig);
    this.formErrors = new FormErrors(this.form);
    if (!+this.event.price) {
      this.paymentType = 'free';
      this.onPriceTypeChange();
    } else {
      this.paymentType = 'fixed';
      this.onPriceTypeChange();

    }

    if (this.event.locationType) {
      this.onLocationTypeChange(this.event.locationType);
    }
  }

  active(el) {
    return el.checked;
  }

  onChangeTime(date, dateName) {
    const hours = new Date(date).getHours();
    const minutes = new Date(date).getMinutes();
    const seconds = new Date(date).getSeconds();
    this.form.value[dateName] = this.form.value[dateName] || new Date();
    this.form.value[dateName].setHours(hours, minutes, seconds);
  }

  onLocationTypeChange(locationType: string): void {
    locationType === 'Physical' ? this.form.controls['address'].setValidators(Validators.required) : this.form.controls['address'].clearValidators();
    this.form.controls['address'].updateValueAndValidity();

    locationType === 'Physical' ? this.form.controls['zip'].setValidators(Validators.required) : this.form.controls['zip'].clearValidators();
    this.form.controls['zip'].updateValueAndValidity();
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
    if (+this.form.value.discountedPrice) {
      this.form.value.oldPrice = this.form.value.price;
      this.form.value.price = this.form.value.discountedPrice;
    }
    this.form.value.weekdays = this.form.value.weekdays.length ? this.form.value.weekdays.toString() : '';
    this.form.value.timeType = this.form.value.timeType === 'Onetime' ? this.form.value.timeType : this.recurringType;
    if (this.form.value.allDay && !this.form.value.start) {
      this.form.value.start = new Date();
    }
    this.onSubmit.emit(this.form.value);
  }

  onCategoriesSubmit() {
    this.showCategoriesPopup = false;
  }

  cancel() {
    this.location.back();
  }

  deleteEvent() {
    this.showDeletePopup = true;
  }

  onDelete() {
    this.onDeleteEvent.emit();
  }

  onPriceTypeChange() {
    this.paymentType === 'fixed' ? this.form.controls['price'].setValidators(Validators.required) : this.form.controls['price'].clearValidators();
    this.form.controls['price'].updateValueAndValidity();
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
