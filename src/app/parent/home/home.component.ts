import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BusinessPortalService } from '../../core/business-portal.service';
import { BusinessType } from '../../core/shared/business-type.model';
import { UserService } from '../../core/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserProfile } from '../../user/shared/user-profile.model';
import { LocationParams } from '../../core/shared/location-params';
import { Constants } from '../../shared/constants';
import { ShortenStatePipe } from '../../shared/shorten-state.pipe';

@Component({
  selector: 'kz-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  public isMobile: boolean;
  public bestCategories: BusinessType[] = [];
  public popularPlaces: BusinessType[] = [];
  public isLocationPopupShown: boolean;
  public defaultPictureUrl: string;
  public profile: UserProfile;

  private locationParams: LocationParams = {};

  private userLocation = JSON.parse(localStorage.getItem('kz-geolocation'));

  constructor(
    private businessPortalService: BusinessPortalService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private shortenStatePipe: ShortenStatePipe,
  ) {
    this.locationParams.types = ['place', 'region'].join(',');
    this.locationParams.country = Constants.AllowedCountries.join(',');
  }

  ngOnInit() {
    this.defaultPictureUrl = '../../../assets/images/home/business.svg';
    this.isMobile = this.userService.isMobile();

    this.businessPortalService.getCategories({
      limit: 8,
      level: 0,
    }).subscribe((items) => {
      this.bestCategories = items;
    });

    if (this.userLocation) {
      this.getPopularPlaces();
    }
  }

  viewAllCategories() {
    if (this.userLocation) {
      this.router.navigate(['business-portal/search-result']);
    } else {
      this.openGeolocationDialog();
    }
  }

  getPopularPlaces() {
    this.businessPortalService
      .getLocation(`${this.userLocation.longitude}, ${this.userLocation.latitude}`, this.locationParams)
      .subscribe(response => {
        response.features.map(el => {
          el.place_name = el.place_name
            .split(', ')
            .map((name, i) => (i === 1 ? this.shortenStatePipe.transform(name) : name));

          return el;
        });

        if (response.features[0]) {
          this.businessPortalService.getBestCategories({
            city: response.features[0].place_name[0],
            state: response.features[0].place_name[1],
            country: response.features[0].place_name[2],
            limitBusinesses: 8,
          }).subscribe(({ items }) => {
            this.popularPlaces = items;
          });
        } else {
          localStorage.removeItem('kz-geolocation');
          this.userLocation = null;
          this.openGeolocationDialog();
          this.toastr.warning('Your location is not covered by our system. Please, Enter Your City');
        }
      });
  }

  onBusinessCardClick(business) {
    if (this.userLocation) {
      this.router.navigate(['/', 'business-portal', 'business', business.id]);
    } else {
      this.openGeolocationDialog();
    }
  }

  onGlobalSearchClick(ev) {
    if (!this.userLocation) {
      this.openGeolocationDialog();
    } else {
      if (this.isMobile) {
        this.router.navigate(['business-portal/search']);
      }
    }
  }

  openGeolocationDialog() {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    this.isLocationPopupShown = true;
  }

  useSystemLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          if (position.coords) {
            this.userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            localStorage.setItem('kz-geolocation', JSON.stringify(this.userLocation));
            this.getPopularPlaces();
          }
          this.closeLocationDialog();
        },
        err => {
          this.onHideLocationDialog();
          this.closeLocationDialog();
          console.log(err);
        },
      );
    }
  }

  locationChanged(ev) {
    this.userLocation = {
      longitude: ev[0],
      latitude: ev[1],
    };
    localStorage.setItem('kz-geolocation', JSON.stringify(this.userLocation));
    this.getPopularPlaces();
    this.closeLocationDialog();
  }

  closeLocationDialog() {
    document.body.style.overflow = 'auto';
    document.body.style.position = 'relative';
    this.isLocationPopupShown = false;
  }

  onHideLocationDialog() {
    if (!this.userLocation) {
      this.toastr.info('Turn on geolocation if you want to find businesses near you');
    }
  }

}
