import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BusinessPortalService } from '../../core/business-portal.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { untilComponentDestroyed } from '../componentDestroyed';
import { Constants } from '../constants';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'kz-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationPickerComponent),
      multi: true,
    },
  ],
})
export class LocationPickerComponent implements OnInit, ControlValueAccessor, OnDestroy {
  location: string;
  onChange: (value: any) => void;
  onTouched: () => void;
  results: any[];
  params: any = {};
  countries: string[] = Constants.AllowedCountries;
  disabled = false;
  notFoundText = 'Not found';

  @Input() pickCountry: boolean;
  @Input() pickState: boolean;
  @Input() pickCity: boolean;
  @Input() pickDistrict: boolean;
  @Input() pickAddress: boolean;
  @Input() pickLocality: boolean;
  @Input() allowedCountries: string[] = [];
  @Input() placeholder: string = '';

  constructor(
    private businessPortalService: BusinessPortalService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.userService.getProfileSnapshot().subscribe((user) => {
      this.params.types = [
        this.pickCountry ? 'country' : '',
        this.pickState ? 'region' : '',
        this.pickCity ? 'place' : '',
        this.pickLocality ? 'locality' : '',
        this.pickDistrict ? 'district' : '',
        this.pickAddress ? 'address' : ''].filter(el => el).join(',');
      this.params.country = this.allowedCountries.toString() || user.country;
      for (const prop in this.params) {
        if (!this.params[prop]) {
          delete this.params[prop];
        }
      }
    });
  }

  search(event) {
    this.onChange(event);
    if (event.length > 0) {
      this.businessPortalService.getLocation(event, this.params).pipe(untilComponentDestroyed(this))
        .subscribe(data => {
          if (this.pickAddress) {
            data.features.map((el: any) => {
              el.place_name = el.place_name.split(',').slice(0, -3).join(', ');
              return el;
            });
          }
          // if (this.pickCity) {
          //   data.features.map((el: any) => {
          //     el.text = el.place_name.split(',').slice(0, 2).join(', ');
          //     el.place_name = el.place_name.split(',').slice(0, 1).join(', ');
          //   });
          // }
          data.features = data.features.filter((el: any, i: number) => {
            if (data.features[i + 1]) {
              return el.text !== data.features[i + 1].text;
            } else {
              return true;
            }
          });
          this.results = data.features;
        });
    }
  }

  writeValue(value: any): void {
    this.location = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  ngOnDestroy(): void {
  }


}
