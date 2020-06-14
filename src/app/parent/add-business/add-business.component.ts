import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';

import { BusinessDirection } from '../../core/shared/enums/business-direction.enum';
import { FormErrors } from '../../core/shared/form-errors';
import { BusinessType } from '../../core/shared/business-type.model';
import { BusinessService } from '../../core/business.service';
import { AppValidators } from '../../core/shared/app-validators';
import { UserService } from '../../core/user.service';
import { Business } from '../../core/shared/business.model';
import { BusinessPortalService } from '../../core/business-portal.service';
import { Constants } from '../../shared/constants';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';

@Component({
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.scss', '../parent.scss'],
})
export class AddBusinessComponent implements OnInit, OnDestroy {
  form: FormGroup;
  formErrors: FormErrors;
  submitted: boolean;
  phoneMask = '';
  businessTypes$: Observable<BusinessType[]>;
  businessTypesQuery = new Subject<string>();
  businessId: number;
  isEditingBusiness = false;
  businessToUpdate: Partial<Business>;
  business: Partial<Business> = {
    businessDirection: BusinessDirection.Physical,
    website: '',
  };

  country = Constants.AllowedCountries[0];
  countries = Constants.AllowedCountries;
  address: any = {};
  onlineAddress: any = {};
  addressSearchResults: any[];
  onlineAddressSearchResults: any[];

  @ViewChild('businessInfoBlock') businessInfoBlockElem: ElementRef;

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private businessService: BusinessService,
    private userService: UserService,
    private businessPortalService: BusinessPortalService,
    private location: Location,
  ) {
  }

  get isPhysical(): boolean {
    return this.business.businessDirection === BusinessDirection.Physical;
  }

  async ngOnInit() {
    this.businessId = +this.activatedRouter.snapshot.paramMap.get('id');
    this.businessTypes$ = this.businessTypesQuery.pipe(
      debounceTime(500),
      switchMap(query => this.businessService.searchTypes(query, { limit: 50 })),
    );
    if (!this.businessId) {
      this.buildForm();
      this.isEditingBusiness = null;
    } else {
      this.businessService.getBusinessById(this.businessId).pipe(untilComponentDestroyed(this)).subscribe(res => {
        this.business = res;
        this.isEditingBusiness = true;
        this.address.place_name = this.convertAddressToString(this.business.address, this.business.city, this.business.state, this.business.zip);
        this.onlineAddress.place_name = this.convertOnlineAddressToString(this.business.city, this.business.state);
        if (this.business.businessTypes.length) {

          this.business.businessType = this.business.businessTypes[0];
        }
        this.buildForm();
      });
    }


  }

  toggleDirection() {
    this.business.businessDirection = this.isPhysical
      ? BusinessDirection.Mobile
      : BusinessDirection.Physical;

    this.buildForm();
  }

  createBusinessToUpdate() {
    const newBusiness = this.form.value;
    this.businessToUpdate = {
      businessDirection: this.business.businessDirection,
      name: newBusiness.name,
      email: newBusiness.email,
      website: newBusiness.website,
      businessType: newBusiness.businessType,
      address: newBusiness.address,
      latitude: newBusiness.latitude,
      longitude: newBusiness.longitude,
      address2: newBusiness.address2,
      city: newBusiness.city,
      zip: newBusiness.zip,
      state: newBusiness.state,
    } as Partial<Business>;
  }

  onSubmit() {
    this.formErrors.setSubmitted();

    if (!this.form.valid || this.submitted) {
      return;
    }

    this.submitted = true;
    this.isEditingBusiness ? this.updateBusiness() : this.addBusiness();
  }

  addBusiness() {
    const newBusiness = this.form.value;
    this.businessService.createBusiness(newBusiness).pipe(untilComponentDestroyed(this)).subscribe(
      () =>
        this.router.navigate([{ outlets: { primary: ['dashboard'], popup: ['business-locked'] } }]),
      error => {
        this.submitted = false;

        // todo: http error common handler/transformer
        if (error instanceof HttpErrorResponse) {
          const requestError = error.error || {};

          if (error.status === 400 && requestError.message) {
            this.toastr.error(requestError.message);

            if (this.isPhysical) {
              this.businessInfoBlockElem.nativeElement.scrollIntoView();
            }
          }
        }
      },
    );
  }

  updateBusiness() {
    this.createBusinessToUpdate();
    this.businessService.updateBusiness(this.business.id, this.businessToUpdate).pipe(untilComponentDestroyed(this)).subscribe(
      () => {
        this.location.back();
      },
      error => {
        this.submitted = false;

        // todo: http error common handler/transformer
        if (error instanceof HttpErrorResponse) {
          const requestError = error.error || {};

          if (error.status === 400 && requestError.message) {
            this.toastr.error(requestError.message);

            if (this.isPhysical) {
              this.businessInfoBlockElem.nativeElement.scrollIntoView();
            }
          }
        }
      },
    );
  }

  searchBusinessTypes(query: string): void {
    this.businessTypesQuery.next(query);
  }

  searchAddress(event) {
    this.selectAddress(null);
    this.businessPortalService.getLocation(event.query, {
      types: ['address'],
      country: this.country,
      limit: 10,
    }).pipe(untilComponentDestroyed(this))
      .subscribe(data => {
        this.addressSearchResults = data.features;
      });
  }

  searchOnlineAddress(event) {
    this.selectOnlineAddress(null);
    this.businessPortalService.getLocation(event.query, {
      types: ['place', 'region', 'locality'].toString(),
      country: this.country,
    }).pipe(untilComponentDestroyed(this))
      .subscribe(data => {
        this.onlineAddressSearchResults = data.features.map((feature) => {
          feature.place_name = feature.place_name.split(', ').slice(0, -1).join(', ');
          return feature;
        });
      });
  }


  convertOnlineAddressToString(city, state): string {
    return city && state ? `${city}, ${state}` : '';
  }

  convertAddressToString(address, city, state, zip): string {
    return address && city && state && zip ? `${address || ''}, ${city || ''}, ${state || ''} ${zip || ''}` : '';
  }

  selectAddress(event) {
    if (!event) {
      this.form.controls['address'].setValue('');
      this.form.controls['latitude'].setValue('');
      this.form.controls['longitude'].setValue('');
      this.form.controls['city'].setValue('');
      this.form.controls['state'].setValue('');
      this.form.controls['zip'].setValue('');
      this.setCoordinates('', '');

      return;
    }

    this.form.controls['address'].setValue((event.address ? event.address + ' ' : '') + event.text);
    if (event.id.substring(0, 7) === 'address') {
      event.context.forEach(context => {
        if (context.id.substring(0, 5) === 'place' && !this.form.get('city').value) {
          this.form.controls['city'].setValue(context.text);
        } else if (context.id.substring(0, 8) === 'locality') {
          this.form.controls['city'].setValue(context.text);
        } else if (context.id.substring(0, 6) === 'region') {
          this.form.controls['state'].setValue(context.text);
        } else if (context.id.substring(0, 8) === 'postcode') {
          this.form.controls['zip'].setValue(context.text);
        }
      });
    } else if (event.id.substring(0, 5) === 'place') {
      event.context.forEach(context => {
        if (context.id.substring(0, 6) === 'region') {
          this.form.controls['state'].setValue(context.text);
        } else if (context.id.substring(0, 8) === 'postcode') {
          this.form.controls['zip'].setValue(context.text);
        }
      });
      this.form.controls['city'] = event.text;
    } else if (event.id.substring(0, 8) === 'locality') {
      event.context.forEach(context => {
        if (context.id.substring(0, 6) === 'region') {
          this.form.controls['state'].setValue(context.text);
        } else if (context.id.substring(0, 8) === 'postcode') {
          this.form.controls['zip'].setValue(context.text);
        }
      });
      this.form.controls['city'] = event.text;
    }

    this.setCoordinates(event.geometry.coordinates[0], event.geometry.coordinates[1]);
  }

  selectOnlineAddress(event) {
    if (!event) {
      this.form.controls['city'].setValue('');
      this.form.controls['state'].setValue('');
      return;
    }

    if (event.id.substring(0, 7) === 'address') {
      event.context.forEach(context => {
        if (context.id.substring(0, 5) === 'place') {
          this.form.controls['city'].setValue(context.text);
        } else if (context.id.substring(0, 6) === 'region') {
          this.form.controls['state'].setValue(context.text);
        }
      });
    } else if (event.id.substring(0, 5) === 'place') {
      this.form.controls['city'].setValue(event.text);
      event.context.forEach(context => {
        if (context.id.substring(0, 6) === 'region') {
          this.form.controls['state'].setValue(context.text);
        }
      });
    } else if (event.id.substring(0, 8) === 'locality') {
      this.form.controls['city'].setValue(event.text);
      event.context.forEach(context => {
        if (context.id.substring(0, 6) === 'region') {
          this.form.controls['state'].setValue(context.text);
        }
      });
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

  ngOnDestroy(): void {
  }

  private buildForm(): void {
    this.userService
      .getProfileSnapshot()
      .pipe(untilComponentDestroyed(this))
      .subscribe(profile => {
        this.phoneMask = `+${profile.phoneCode} ${profile.phoneMask}`;
        this.country = !this.businessId ? profile.country : this.business.country;
      });

    let formConfig = {
      name: [this.business.name || '', Validators.required],
      phone: [this.business.phone || '',
        [Validators.required, Validators.minLength(10)],
        // todo: re-use validator
        (control: AbstractControl): Observable<ValidationErrors | null> => {
          if (!control.dirty) {
            return of(null);
          }

          return this.businessService.validatePhone(control.value, 'business').pipe(
            map(() => null),
            catchError(error => {
              // todo: http error common handler/transformer
              if (error instanceof HttpErrorResponse) {
                const requestError = error.error || {};

                if (requestError.errorType === 'PhoneNumberInUseError') {
                  return of({
                    invalid:
                      'Oops! Looks like this business is already "Locked" in Kidazzler. Try "Locking" another one.',
                  });
                } else if (requestError.message) {
                  return of({ invalid: requestError.message });
                }
              }
            }),
          );
        },
      ],
      businessType: [this.business.businessType || null, Validators.required],
      email: [this.business.email || '', AppValidators.email],
      website: [this.business.website || ''],
      businessDirection: [this.business.businessDirection],
      city: [this.business.city || '', Validators.required],
      state: [this.business.state || '', Validators.required],
    };

    if (this.isPhysical) {
      formConfig = Object.assign(formConfig, {
        address: [this.business.address || '', Validators.required],
        address2: [this.business.address2 || ''],
        zip: [this.business.zip || ''],
        latitude: [this.business.latitude || ''],
        longitude: [this.business.longitude || ''],
      });
    }

    this.form = this.formBuilder.group(formConfig);
    this.formErrors = new FormErrors(this.form);
  }

  private setCoordinates(longitude, latitude) {
    this.form.controls['longitude'].setValue(longitude);
    this.form.controls['latitude'].setValue(latitude);
  }
}
