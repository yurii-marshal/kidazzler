import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { BusinessService } from '../../core/business.service';
import { Age } from '../../core/shared/age';
import { Amenity } from '../../core/shared/amenity';
import { FormErrors } from '../../core/shared/form-errors';
import { Rating } from '../../core/shared/rating';
import { SearchParams } from '../../core/shared/search-params';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';
import { Constants } from '../../shared/constants';

@Component({
  selector: 'kz-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss', '../business-portal.scss'],
})
export class SearchFilterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  formErrors: FormErrors;
  amenities: Amenity[];
  ratings: Rating[] = Constants.Ratings;
  ages: Age[] = Constants.Ages;
  params: SearchParams = {};
  showAllFeatures = false;

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private spinner: NgxUiLoaderService,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.pipe(untilComponentDestroyed(this)).subscribe((params: SearchParams) => {
      this.params = { ...params };
    });
    this.spinner.start();
    this.businessService
      .getAmenities({ limit: 6 })
      .pipe(untilComponentDestroyed(this))
      .subscribe(response => {
        this.amenities = response.items;
        this.buildForm();
        this.spinner.stop();
      }, () => {
        this.spinner.stop();
      });
  }

  buildForm(): void {
    const rating = this.params.minRating ? { minRating: +this.params.minRating } : null;
    const ages = this.params.ageFrom ? { ageFrom: +this.params.ageFrom, ageTo: this.params.ageTo } : null;
    const isMobile = this.params.direction && this.params.direction.split(',')
      .filter(el => el === 'Mobile').join(',') || null;
    const isPhysical = this.params.direction && this.params.direction.split(',')
      .filter(el => el === 'Physical').join(',') || null;
    this.form = this.fb.group({
      amenities: new FormArray([]),
      rating: [rating],
      ages: [ages],
      byAppointment: [this.params.byAppointment || null],
      isMobile: [isMobile],
      isPhysical: [isPhysical],
      hasDeals: [this.params.hasDeals || null],
      hasEvents: [this.params.hasEvents || null],
      hasFreeEvents: [this.params.hasFreeEvents || null],
      hasFreeDeals: [this.params.hasFreeDeals || null],
    });
    this.formErrors = new FormErrors(this.form);
    this.addAmenities();
    if (ages) {
      this.form.controls['ages'].patchValue(this.ages[this.ages.map(age => age.ageFrom).indexOf(ages.ageFrom)]);
    }
    if (rating) {
      this.form.controls['rating'].patchValue(this.ratings[this.ratings.map(rate => rate.minRating).indexOf(rating.minRating)]);
    }
  }

  clearFilter(): void {
    this.form.reset();
  }

  showAllAmenities(): void {
    this.showAllFeatures = !this.showAllFeatures;
  }

  addAmenities() {
    if (this.params.amenities) {
      this.amenities.map((o, i) => {
        const control = new FormControl(!!this.params.amenities.match(o.id));
        (this.form.controls.amenities as FormArray).push(control);
      });
    } else {
      this.amenities.map((o, i) => {
        const control = new FormControl(false);
        (this.form.controls.amenities as FormArray).push(control);
      });
    }

  }

  onChange(event) {
    console.log(event, this.form.get('rating'));
  }

  submit(): void {
    this.params.amenities = this.form.value.amenities
      .map((v, i) => (v ? this.amenities[i].id : null))
      .filter(v => v !== null);
    this.params.byAppointment = this.form.value.byAppointment;
    this.params.direction = this.form.value.isMobile ? (this.form.value.isPhysical ? 'Physical,Mobile' : 'Mobile') : (this.form.value.isPhysical ? 'Physical' : '');
    this.params.hasDeals = this.form.value.hasDeals;
    this.params.hasEvents = this.form.value.hasEvents;
    this.params.hasFreeEvents = this.form.value.hasFreeEvents;
    this.params.hasFreeDeals = this.form.value.hasFreeDeals;
    this.params.amenities =
      this.params.amenities && this.params.amenities.length
        ? this.params.amenities.join(',')
        : null;
    this.params.ageFrom = this.form.value.ages ? this.form.value.ages.ageFrom : null;
    this.params.ageTo = this.form.value.ages ? this.form.value.ages.ageTo : null;
    this.params.minRating = this.form.value.rating ? this.form.value.rating.minRating : null;

    for (const prop in this.params) {
      if (this.params[prop] === false || this.params[prop] === null) {
        delete this.params[prop];
      }
    }
    this.router.navigate(['/business-portal/search-result'], { queryParams: this.params });
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
  }
}
