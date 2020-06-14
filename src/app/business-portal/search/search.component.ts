import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { combineLatest, of, forkJoin } from 'rxjs';
import { BusinessPortalService } from '../../core/business-portal.service';
import { BusinessService } from '../../core/business.service';
import { BusinessType } from '../../core/shared/business-type.model';
import { Business } from '../../core/shared/business.model';
import { LocationParams } from '../../core/shared/location-params';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';
import { SearchParams } from '../../core/shared/search-params';
import { Constants } from '../../shared/constants';
import { ShortenStatePipe } from '../../shared/shorten-state.pipe';
import { ShortenCountryPipe } from '../../shared/shorten-country.pipe';

interface AppWindow extends Window {
  postAppMessage(message: any): void;
}

declare let window: AppWindow;

@Component({
  selector: 'kz-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss', '../business-portal.scss'],
  providers: [ShortenStatePipe, ShortenCountryPipe],
})
export class SearchComponent implements OnInit, OnDestroy {
  category: BusinessType;
  businessTypeQuery: string;
  search: string;
  locations: any[];
  locationQuery: string;
  bestCategories: BusinessType[];
  businessTypes: BusinessType[];
  currentLocation: any;
  isQuerySearchActive: boolean = false;
  isQueryLocationActive: boolean = false;
  businesses: Business[];
  nearbyBusinesses: Business[];
  params: SearchParams = {};
  locationParams: LocationParams = {};

  constructor(
    private route: ActivatedRoute,
    private businessPortalService: BusinessPortalService,
    private businessService: BusinessService,
    private router: Router,
    private spinner: NgxUiLoaderService,
    private shortenStatePipe: ShortenStatePipe,
    private shortenCountryPipe: ShortenCountryPipe,
  ) {
  }

  ngOnInit() {
    this.currentLocation = this.route.snapshot.queryParams['currentLocation'] || null;
    this.locationParams.types = ['place', 'locality'].join(',');
    this.locationParams.country = Constants.AllowedCountries.join(',');
    this.params.category = this.route.snapshot.queryParams['category'];
    if (!this.currentLocation) {
      this.params.nearby = true;
    } else {
      const arr = this.currentLocation.split(', ');
      if (arr.length === 3) {
        this.params.city = arr[0];
        this.params.state = arr[1];
        this.params.country = arr[2];
      } else {
        this.params.city = arr[0];
        this.params.country = arr[1];
      }
    }
    this.locationParams.types = ['place', 'locality'].join(',');
    this.locationParams.country = Constants.AllowedCountries.join(',');
    for (const prop in this.params) {
      if (!this.params[prop]) {
        delete this.params[prop];
      }
    }
    this.spinner.startLoader('search-results');
    const category$ = this.params.category
      ? this.businessPortalService.getCategory(this.params.category)
      : of({});
    combineLatest(
      this.businessPortalService.getCategories({ level: 0, limit: 8 }),
      this.businessPortalService.getBusinesses(this.params),
      category$,
    )
      .pipe(untilComponentDestroyed(this))
      .subscribe(
        ([bestCategories, { items }, category]) => {
          this.bestCategories = bestCategories;
          this.nearbyBusinesses = items;
          this.category = category;
          this.search = this.category.code;
        },
        () => {
        },
        () => {
          this.spinner.stopLoader('search-results');
          // post message for mobile app
          setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 1200);
        },
      );
  }

  onSearchSubmit(): void {
    this.goToResults({
      category: this.category && this.category.id,
      query: this.businessTypeQuery,
      city: this.currentLocation && this.getAddress(this.currentLocation, 'city') || this.params.city,
      state: this.currentLocation && this.getAddress(this.currentLocation, 'region') || this.params.state,
      country: this.currentLocation && this.getAddress(this.currentLocation, 'country') || this.params.country,
      coordinatesBox: this.currentLocation && this.currentLocation.bbox,
    });
  }

  setNearbyLocation(): void {
    this.currentLocation = { place_name: '' };
    this.isQueryLocationActive = false;
  }

  onLocationChange(query: string): void {
    if (query) {
      this.isQuerySearchActive = false;
      this.isQueryLocationActive = true;
      this.locationQuery = query;
      this.spinner.startLoader('location-results');
      this.businessPortalService
        .getLocation(query, this.locationParams)
        .pipe(untilComponentDestroyed(this))
        .subscribe(
          response => {
            this.locations = response.features.map(el => {
              el.place_name = el.place_name
                .split(', ')
                .map((name, i) => (i === 1 ? this.shortenStatePipe.transform(name) : name))
                .slice(0, 2)
                .join(', ');
              return el;
            });
          },
          () => {
          },
          () => {
            this.spinner.stopLoader('location-results');
          },
        );
    } else {
      this.isQueryLocationActive = false;
      this.onApplyAddress(null);
    }

  }

  onSearchChange(query: string): void {
    if (query) {
      this.isQuerySearchActive = true;
      this.isQueryLocationActive = false;
      this.businessTypeQuery = query;
      this.spinner.startLoader('search-results');
      forkJoin(
        this.businessService.searchTypes(query, {search: true}),
        this.businessPortalService.getBusinesses(Object.assign({ query: query }, this.params)),
      )
        .pipe(untilComponentDestroyed(this))
        .subscribe(
          ([businessTypes, { items }]) => {
            this.businessTypes = businessTypes;
            this.businesses = items.splice(0, 3);
          },
          () => {
          },
          () => {
            this.spinner.stopLoader('search-results');
          },
        );
    } else {
      this.isQuerySearchActive = false;
    }

  }

  onApplyAddress(address): void {
    this.currentLocation = address;
    this.isQueryLocationActive = false;
    delete this.params['city'];
    delete this.params['state'];
    delete this.params['country'];
    if (!address) {
      this.params['nearby'] = true;
    } else {
      delete this.params['nearby'];
      if (address.id.substring(0, 5) === 'place' || address.id.substring(0, 8) === 'locality') {
        address.context.forEach(context => {
          if (context.id.substring(0, 6) === 'region') {
            this.params['state'] = context.text;
          } else if (context.id.substring(0, 7) === 'country') {
            this.params['country'] = context.text;
          }
        });
        this.params['city'] = address.text;
      }

      this.goToResults(this.params);
    }

    this.businessPortalService.getBusinesses(this.params)
      .subscribe(({ items }) => {
        this.nearbyBusinesses = items;
      });
  }

  getAddress(addressObj, property): string {
    let result = '';
    if (addressObj && addressObj.context) {
      if (addressObj.context.length === 2) {
        if (property !== 'city') {
          addressObj.context.forEach(address => {
            if (address.id.includes(property)) {
              result = address.text;
            }
          });
          return result;
        } else {
          return addressObj.text;
        }
      } else {
        return property === 'region' ?
          addressObj.text :
          (property === 'city' ? '' :
            this.shortenCountryPipe.transform(addressObj.context[0].text));
      }
    } else {
      return null;
    }
  }

  goToResults(params?) {
    this.router.navigate(['/business-portal/search-result'], {
      queryParams: {
        category: params.category,
        query: params.query,
        city: params.city,
        state: params.state,
        country: this.shortenCountryPipe.transform(params.country),
        coordinatesBox: params.coordinatesBox && params.coordinatesBox.join(','),
      },
    });
  }

  ngOnDestroy(): void {
  }
}
