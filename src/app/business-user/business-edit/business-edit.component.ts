import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AutoComplete } from 'primeng/autocomplete';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { BusinessPortalService } from '../../core/business-portal.service';
import { BusinessService } from '../../core/business.service';
import { Age } from '../../core/shared/age';
import { AppValidators } from '../../core/shared/app-validators';
import { BusinessType } from '../../core/shared/business-type.model';
import { Business } from '../../core/shared/business.model';
import { BusinessDirection } from '../../core/shared/enums/business-direction.enum';
import { FormErrors } from '../../core/shared/form-errors';
import { UserService } from '../../core/user.service';
import { ValidationService } from '../../core/validation.service';
import { Constants } from '../../shared/constants';
import { UserProfile } from '../../user/shared/user-profile.model';

@Component({
  selector: 'kz-business-edit',
  templateUrl: './business-edit.component.html',
  styleUrls: ['./business-edit.component.scss', '../business-user.scss'],
  providers: [ValidationService],
})
export class BusinessEditComponent implements OnInit {

  @ViewChild('categoryAutoComplete') categoryAutoComplete: AutoComplete;
  @ViewChild('featureAutoComplete') featureAutoComplete: AutoComplete;
  submitted = false;
  isPending;
  formErrors: FormErrors;
  form: FormGroup;
  business: Business;
  phoneMask: string;
  businessTypes: Observable<BusinessType[]>;
  businessChosenTypes: FormArray;
  businessTypesList: BusinessType[];
  businessChosenFeatures: string;
  businessFeatures: any[] = [];
  businessTypesQuery$ = new Subject<string>();
  businessId: number;
  claimingToken: string;
  agesRange: Age;
  agesRangeList: Age[] = Constants.Ages;
  pageHeader = 'Edit your Business';
  locationOptions = [{ label: 'Physical', value: true }, { label: 'Mobile', value: false }];
  showCategoriesPopup: boolean;
  showFeaturesPopup: boolean;
  categorySearch: string;
  currentCategoryIndex: number;
  currentFeatures: any[] = [];
  weekdays = [];
  isVerifyingBusiness: boolean;
  hours;

  isLoading: boolean;

  minDate = new Date(new Date().setHours(0, 0, 0));
  maxDate = new Date(new Date().setHours(23, 0, 0));
  selectedAmenities = [];
  searchedAmenities = [];

  country = Constants.AllowedCountries[0];
  countries = Constants.AllowedCountries;
  address: any = {};
  onlineAddress: any = {};
  addressSearchResults: any[];
  onlineAddressSearchResults: any[];

  isChosenTypesWarning: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private businessService: BusinessService,
    private businessPortalService: BusinessPortalService,
    private validationService: ValidationService,
    private spinner: NgxUiLoaderService,
    private location: Location,
    private userService: UserService,
  ) {
  }

  private _isPhysical: boolean;

  get isPhysical(): boolean {
    return this._isPhysical;
  }

  set isPhysical(value) {
    this._isPhysical = value;
  }

  get isMobile(): boolean {
    return this.userService.isMobile();
  }

  ngOnInit() {
    this.isLoading = true;
    this.spinner.startLoader('business-edit');

    this.claimingToken = localStorage.getItem('business-claiming-token');
    // if came from email link
    localStorage.removeItem('business-id');
    localStorage.removeItem('business-claiming-token');

    this.businessId = this.activatedRoute.snapshot.paramMap.has('id') ? +this.activatedRoute.snapshot.paramMap.get('id') : null;

    this.isVerifyingBusiness = this.activatedRoute.snapshot.data['action'] === 'verifyBusiness';

    this.getBusinessSource().subscribe(
      result => {
        this.business = result;

        this._isPhysical = this.business.businessDirection === BusinessDirection.Physical;

        if (this._isPhysical) {
          this.address.place_name =
            `${this.business.address}, ${this.business.city}, ${this.business.state}`
            + (this.business.zip ? `, ${this.business.zip}` : '');
        } else {
          this.onlineAddress.place_name = `${this.business.city}, ${this.business.state}`;
        }

        combineLatest(
          this.userService.getProfileSnapshot(),
          this.businessService.getPhoneInfo(this.business.country),
        )
          .subscribe(([profile, phone]) => {
            this.country = profile.country;
            this.phoneMask = `+${phone.code} ${phone.mask}`;
          });

        this.agesRange = { ageFrom: this.business.ageFrom, ageTo: this.business.ageTo };

        this.businessChosenFeatures = this.business.amenities
          .map(feature => feature.name)
          .join(', ');

        this.selectedAmenities = this.business.amenities;

        this.businessService.getAmenities()
          .subscribe(data => {
            data.items.forEach(item => {
              this.businessFeatures.push({
                id: item.id,
                name: item.name,
                value: !!this.business.amenities.find(amenity => amenity.id === item.id),
              });
            });
            this.currentFeatures = this.businessFeatures.map(o => ({ ...o }));
            this.searchedAmenities = this.currentFeatures;
          });

        const hours = this.business.workingHours
          ? Object.keys(this.business.workingHours).map(i => this.business.workingHours[i])
          : [];

        this.weekdays = this.businessService.getWeekdaysArray(hours, 'SU');

        this.buildForm();
        this.spinner.stopLoader('business-edit');
        this.isLoading = false;
      },
      e => {
        if (e.status === 400 && e.error.message) {
          this.toastr.error(e.error.message);
        }
        this.spinner.stopLoader('business-edit');
        this.isLoading = false;
        this.router.navigate(['/']);
      },
    );

    this.businessTypesQuery$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      filter(str => str.length > 1),
    ).subscribe(val =>
      this.businessService.searchTypes(val).subscribe(data => {
        this.businessTypesList = data.filter(item => !this.findChosenType(item));
      }),
    );
  }

  buildForm(): void {
    const controlsConfig = {
      name: [this.business.name || '', [Validators.required, Validators.maxLength(80)]],
      phone: [
        this.business.phone || '',
        [Validators.minLength(10)],
        this.validationService.validatePhone.bind(this.validationService),
      ],
      phone2: [
        this.business.phone2 || '',
        [Validators.minLength(10)],
        this.validationService.validatePhone.bind(this.validationService),
      ],
      email: [this.business.email, AppValidators.email],
      about: [this.business.about, [Validators.required, Validators.maxLength(4000)]],
      ageFrom: [this.business.ageFrom],
      ageTo: [this.business.ageTo],
      businessDirection: [this.business.businessDirection || 'Physical'],
      website: [this.business.website],
      byAppointment: [this.business.byAppointment || false],
      hidePhone: [this.business.hidePhone || false],
      businessTypes: this.fb.array([]),
      amenities: [this.businessChosenFeatures],
      city: [this.business.city || '', Validators.required],
      state: [this.business.state || '', Validators.required],
    };

    if (this.business.businessDirection === 'Physical') {
      Object.assign(controlsConfig, {
        address: [this.business.address || '', Validators.required],
        address2: [this.business.address2 || ''],
        zip: [this.business.zip || ''],
        latitude: [this.business.latitude],
        longitude: [this.business.longitude],
      });
    }

    this.form = this.fb.group(controlsConfig);

    this.form.value['businessDirection'] = this.business.businessDirection;

    this.businessChosenTypes = new FormArray([]);
    this.business.businessTypes.forEach(item => {
      this.addCategoryToBusiness(item);
    });

    // todo: find solution to fix this (not to call async validation on submit)
    this.form.statusChanges.subscribe(() => {
      if (!this.form.pending && this.isPending) {
        this.onSubmit();
      }
    });

    this.formErrors = new FormErrors(this.form);
  }

  searchAddress(event) {
    this.selectAddress(null);
    this.businessPortalService.getLocation(event.query, {
      types: ['address'],
      country: this.country,
    }).subscribe(data => {
      this.addressSearchResults = data.features;
    });
  }

  searchOnlineAddress(event) {
    this.selectOnlineAddress(null);
    this.businessPortalService.getLocation(event.query, {
      types: ['place', 'region', 'locality'].toString(),
      country: this.country,
    }).subscribe(data => {
      this.onlineAddressSearchResults = data.features.map((feature) => {
        feature.place_name = feature.place_name.split(', ').slice(0, -1).join(', ');
        return feature;
      });
    });
  }

  selectAddress(event) {
    if (!event) {
      this.form.controls['address'].setValue('');
      this.form.controls['city'].setValue('');
      this.form.controls['state'].setValue('');
      this.form.controls['zip'].setValue('');
      this.setCoordinates('', '');

      return;
    }

    this.form.controls['address'].setValue((event.address ? event.address + ' ' : '') + event.text);

    event.context.forEach(context => {
      if (context.id.substring(0, 5) === 'place') {
        this.form.controls['city'].setValue(context.text);
      } else if (context.id.substring(0, 8) === 'locality') {
        this.form.controls['city'].setValue(context.text);
      } else if (context.id.substring(0, 6) === 'region') {
        this.form.controls['state'].setValue(context.text);
      } else if (context.id.substring(0, 8) === 'postcode') {
        this.form.controls['zip'].setValue(context.text);
      }
    });

    this.setCoordinates(event.geometry.coordinates[0], event.geometry.coordinates[1]);
  }

  selectOnlineAddress(event) {
    if (!event) {
      this.form.controls['city'].setValue('');
      this.form.controls['state'].setValue('');
      return;
    }

    if (event.context.length > 1) {
      this.form.controls['city'].setValue(event.text);
      event.context.forEach(context => {
        if (context.id.substring(0, 6) === 'region') {
          this.form.controls['state'].setValue(context.text);
        }
      });
    } else {
      this.form.controls['state'].setValue(event.text);
    }
  }

  clearValue(isPhysical) {
    if (isPhysical) {
      this.address = null;
      this.selectAddress(null);
    } else {
      this.onlineAddress = null;
      this.selectOnlineAddress(null);
    }
  }

  findChosenType(type) {
    return this.businessChosenTypes.value.some(item => item.id === type.id);
  }

  onOpenoverChange(index) {
    if (this.weekdays[index].value) {
      this.weekdays[index].hours.startAt = new Date(new Date().setHours(0, 0, 0));
      this.weekdays[index].hours.endAt = new Date(new Date().setHours(23, 0, 0));
    }
  }

  onWeekDayChange(index) {
    if (!this.weekdays[index].value) {
      this.weekdays[index].hours.startAt = null as any;
      this.weekdays[index].hours.endAt = null as any;
    }
  }

  onAgeChange(range): void {
    if (this.form.value['ageFrom'] === range.ageFrom) {
      this.form.controls['ageFrom'].setValue(null);
      this.form.controls['ageTo'].setValue(null);
    } else {
      this.form.controls['ageFrom'].setValue(range.ageFrom);
      this.form.controls['ageTo'].setValue(range.ageTo);
    }
  }

  clearTimeInputs(index) {
    if (this.weekdays[index].isOpenover) {
      this.weekdays[index].isOpenover = false;
    }
    this.weekdays[index].hours.startAt = '';
    this.weekdays[index].hours.endAt = '';
  }

  createBusinessTypeItem(data): FormGroup {
    return this.fb.group({
      id: data.id,
      code: data.code,
    });
  }

  addCategoryToBusiness(category: BusinessType) {
    this.businessChosenTypes = this.form.get('businessTypes') as FormArray;
    this.businessChosenTypes.push(this.createBusinessTypeItem(category));
  }

  removeBusinessType(item) {
    this.businessChosenTypes = this.form.get('businessTypes') as FormArray;
    if (this.businessChosenTypes.controls.length > 1) {
      this.businessChosenTypes.removeAt(
        this.businessChosenTypes.value.findIndex(type => type.id === item.value.id),
      );
    } else {
      this.isChosenTypesWarning = true;
    }
  }

  openCategoryList(index) {
    document.body.style.overflowY = 'hidden';
    document.body.style.position = 'fixed';
    this.currentCategoryIndex = index;
    this.showCategoriesPopup = true;
  }

  searchCategory(event) {
    const query = event.query.toLowerCase();
    if (query) {
      this.businessTypesQuery$.next(query);
    } else {
      this.businessTypesList = [];
    }
  }

  chooseCategory(item: BusinessType) {
    this.isChosenTypesWarning = false;
    this.businessChosenTypes = this.form.get('businessTypes') as FormArray;
    if (!!this.currentCategoryIndex) {
      this.businessChosenTypes.controls[this.currentCategoryIndex].patchValue(item);
    } else {
      this.businessChosenTypes.push(this.createBusinessTypeItem(item));
    }
    this.closeCategoriesPopup();
    if (!!this.categoryAutoComplete) {
      this.categoryAutoComplete.writeValue(null);
    }
  }

  closeCategoriesPopup() {
    document.body.style.overflowY = 'auto';
    document.body.style.position = 'relative';
    this.showCategoriesPopup = false;
  }

  openFeaturesPopup() {
    document.body.style.overflowY = 'hidden';
    document.body.style.position = 'fixed';
    this.currentFeatures = this.businessFeatures.map(o => ({ ...o }));
    this.showFeaturesPopup = true;
  }

  searchFeature(event) {
    const query = event.query && event.query.toLowerCase() || '';
    this.searchedAmenities = query.length > 0 ? this.businessFeatures
        .filter(item => item.value !== true)
        .filter(item => item.name.toLowerCase().includes(query)) :
      this.businessFeatures.filter(item => item.value !== true);
  }

  selectFeature(item) {
    this.selectedAmenities.push(item);
    this.currentFeatures.map(feature => {
      if (feature.id === item.id) {
        feature.value = true;
      }
      return feature;
    });
    this.saveFeatures();
    this.featureAutoComplete.writeValue(null);
  }

  removeFeature(item) {
    this.selectedAmenities = this.selectedAmenities.filter(f => f.id !== item.id);
    this.currentFeatures.map(feature => {
      if (feature.id === item.id) {
        feature.value = false;
      }
      return feature;
    });
    this.saveFeatures();
  }

  saveFeatures() {
    this.businessFeatures = this.currentFeatures.map(o => ({ ...o }));
    this.businessChosenFeatures = this.currentFeatures
      .filter(item => item.value === true)
      .map(feature => feature.name)
      .join(', ');
    this.form.controls['amenities'].setValue(this.businessChosenFeatures);
    document.body.style.overflowY = 'auto';
    document.body.style.position = 'relative';
    this.showFeaturesPopup = false;
  }

  onFeatureSelect(i) {
    this.currentFeatures[i].value = !this.currentFeatures[i].value;
  }

  closeFeaturesPopup() {
    document.body.style.overflowY = 'auto';
    document.body.style.position = 'relative';
    this.currentFeatures = this.businessFeatures.map(o => ({ ...o }));
    this.showFeaturesPopup = false;
  }

  getBusinessSource(): Observable<Business> {
    if (this.businessId === -1) {
      return this.businessService.getUnclaimedBusiness(this.claimingToken);
    }

    if (this.businessId) {
      return this.businessService.getBusinessById(this.businessId);
    }

    return this.userService.getProfileSnapshot().pipe(
      map((profile: UserProfile) => {
        return {
          country: profile.country,
          amenities: [],
          businessTypes: [],
          email: '',
          about: '',
          website: '',
          ageFrom: null,
          ageTo: null,
          businessDirection: 'Physical',
        } as Business;
      }),
    );
  }

  async onSubmit() {
    this.isPending = this.form.pending;
    if (this.isPending) {
      return;
    }

    this.formErrors.setSubmitted();

    const week = this.weekdays.map(o => ({ ...o }));
    this.business.workingHours = this.businessService.getWeekdaysObj(week, 'SU');

    this.form.value['workingHours'] = this.business.workingHours;

    this.form.value['businessTypes'] = this.form.get('businessTypes').value.map(b => b.id);

    this.form.value['amenities'] = this.businessFeatures
      .filter(item => item.value === true)
      .map(f => f.id);

    if (this.businessChosenTypes.controls.length === 0) {
      this.isChosenTypesWarning = true;
    } else if (this.form.valid && !this.submitted) {
      this.isLoading = true;
      this.spinner.startLoader('business-edit');
      this.submitted = true;

      try {
        await this.businessService.updateBusiness(this.business.id, this.form.value).toPromise();

        this.submitted = false;
        this.spinner.stopLoader('business-edit');
        this.isLoading = false;

        this.router.navigate(['../businesses', this.business.id]);
      } catch (response) {
        this.submitted = false;
        this.spinner.stopLoader('business-edit');
        this.isLoading = false;
        if (response.status === 400 && response.error.message) {
          this.toastr.error(response.error.message);
        }
      }
    }
  }

  onLocationTypeChange(type) {
    if (type.value) {
      this.form.addControl('address', new FormControl('', Validators.required));
      this.form.addControl('address2', new FormControl(this.business.address2 || ''));
      this.form.addControl('zip', new FormControl(''));
      this.form.addControl('latitude', new FormControl(this.business.latitude || null));
      this.form.addControl('longitude', new FormControl(this.business.longitude || null));
    } else {
      this.form.removeControl('address');
      this.form.removeControl('address2');
      this.form.removeControl('zip');
      this.form.removeControl('latitude');
      this.form.removeControl('longitude');
    }

    this.business.businessDirection = type.value ? 'Physical' : 'Mobile';
    this.form.controls['businessDirection'].setValue(this.business.businessDirection);
  }

  searchBusinessTypes(query: string): void {
    this.businessTypesQuery$.next(query);
  }

  onCancel() {
    this.location.back();
  }

  private setCoordinates(longitude, latitude) {
    this.form.controls['longitude'].setValue(longitude);
    this.form.controls['latitude'].setValue(latitude);
  }
}
