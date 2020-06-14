import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AccountService } from '../../core/account.service';
import { BusinessPortalService } from '../../core/business-portal.service';
import { LocationParams } from '../../core/shared/location-params';
import { UserService } from '../../core/user.service';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';
import { ShortenStatePipe } from '../../shared/shorten-state.pipe';
import { UserProfile } from '../../user/shared/user-profile.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kz-set-location',
  templateUrl: './set-location.component.html',
  styleUrls: ['./set-location.component.scss', '../business-portal.scss'],
  providers: [ShortenStatePipe],
})
export class SetLocationComponent implements OnInit, OnDestroy {
  isShownLocationPicker = false;
  locations: any[];
  locationQuery: string;
  locationParams: LocationParams = {};

  constructor(
    private accountService: AccountService,
    private router: Router,
    private businessPortalService: BusinessPortalService,
    private userService: UserService,
    private shortenStatePipe: ShortenStatePipe,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    // this.locationParams.country = Constants.AllowedCountries.join(',');
    this.userService.getProfile().subscribe((user) => {
      this.locationParams.types = ['place', 'locality'].join(',');
      this.locationParams.country = user.country;
    });
  }

  enableLocation(): void {
    if (navigator.geolocation) {
      this.spinner.start();
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accountInfo = { latitude: lat, longitude: lng };

          this.businessPortalService
            .getLocation(`${lng},${lat}`, this.locationParams)
            .pipe(untilComponentDestroyed(this),
              switchMap((response) => {
                if (response.features.length) {
                  response.features.forEach((feature) => {
                    if (feature.id.substring(0, 5) === 'place') {
                      accountInfo['city'] = feature.text;
                      feature.context.forEach((context) => {
                        if (context.id.substring(0, 6) === 'region') {
                          accountInfo['state'] = (context.text);
                        }
                      });
                    }
                  });
                  accountInfo['latitude'] = lat;
                  accountInfo['longitude'] = lng;
                  return this.accountService
                    .updateAccountInfo(accountInfo)
                    .pipe(untilComponentDestroyed(this));
                } else {
                  return throwError(`System can't recognize your location. Please, set a custom location`);
                }
              }))
            .subscribe((userProfile: UserProfile) => {
              this.userService.updateProfileInfo(userProfile);
              this.spinner.stop();
              this.router.navigate(['business-portal']);
            }, (err) => {
              this.toastr.info(err);
              this.spinner.stop();
              this.setCustomLocation();
            });
        },
        err => {
          this.spinner.stop();
          this.toastr.error(`Your system doesn't support location service. Please, set a custom location`);
        },
      );
    } else {
      this.toastr.error(`Your system doesn't support location service. Please, set a custom location`);
    }
  }

  setCustomLocation() {
    this.isShownLocationPicker = true;
  }

  onLocationChange(query): void {
    this.locationQuery = query;
    this.businessPortalService
      .getLocation(query, this.locationParams)
      .pipe(untilComponentDestroyed(this))
      .subscribe(response => {
        this.locations = response.features.map(el => {
          el.place_name = el.place_name
            .split(', ')
            .slice(0, 2)
            .join(', ');
          return el;
        });
      });
  }

  onApplyAddress(address): void {
    this.spinner.start();

    const a = address.place_name.split(', ');

    this.accountService
      .updateAccountInfo({
        city: a[0],
        state: a[1],
      })
      .pipe(untilComponentDestroyed(this))
      .subscribe((userProfile: UserProfile) => {
        this.userService.updateProfileInfo(userProfile);
        this.spinner.stop();
        this.router.navigate(['./business-portal']);
      });
  }

  goBack(): void {
    this.isShownLocationPicker = false;
    this.locations = [];
  }

  ngOnDestroy(): void {
  }
}
