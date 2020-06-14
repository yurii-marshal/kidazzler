import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BusinessPortalService } from '../../core/business-portal.service';
import { Business } from '../../core/shared/business.model';
import { UserService } from '../../core/user.service';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';
import { SearchParams } from '../../core/shared/search-params';

interface AppWindow extends Window {
  postAppMessage(message: any): void;
}

declare let window: AppWindow;

@Component({
  selector: 'kz-search-with-map',
  templateUrl: './search-with-map.component.html',
  styleUrls: ['./search-with-map.component.scss', '../business-portal.scss'],
})
export class SearchWithMapComponent implements OnInit, OnDestroy {
  businesses: Business[];
  isOpened: boolean = false;
  coordinatesBox: number[];
  params: SearchParams = {};
  currentBusiness = {} as Business;

  isMobile: boolean;

  constructor(
    private businessPortalService: BusinessPortalService,
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService,
    private spinner: NgxUiLoaderService,
  ) {
  }

  ngOnInit() {
    this.isMobile = this.userService.isMobile();
    this.route.queryParams.pipe(untilComponentDestroyed(this)).subscribe((params: SearchParams) => {
      this.params = { ...params };
    });
    if (!this.params.city && !this.params.country) {
      if (!this.params.coordinatesBox) {
        this.params.nearby = true;
      }
    }


    for (const prop in this.params) {
      if (!this.params[prop]) {
        delete this.params[prop];
      }
    }
    this.spinner.start();

    this.businessPortalService.getBusinesses(this.params).pipe(untilComponentDestroyed(this))
      .subscribe(({ items }) => {
        this.businesses = items;
        this.currentBusiness = this.businesses[0];
      }, () => {
      }, () => {
        this.spinner.stop();
        // post message for mobile app
        setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 1200);
      });

  }

  onSearch(params): void {
    delete this.params.city;
    delete this.params.state;
    delete this.params.country;
    delete this.params.nearby;
    this.spinner.startLoader('search-with-map');
    this.businessPortalService.getBusinesses(Object.assign(this.params, params)).pipe(untilComponentDestroyed(this))
      .subscribe(({ items }) => {
        this.businesses = items;
        this.currentBusiness = this.businesses[0];
      }, () => {
      }, () => {
        this.spinner.stopLoader('search-with-map');
      });
  }

  markerClick(event) {
    this.currentBusiness = event;
  }

  getCurrentBusinessIndex(business): number {
    return this.businesses.findIndex(photo => business.id === photo.id);
  }

  onSwipeLeft() {
    let index = this.getCurrentBusinessIndex(this.currentBusiness);
    index = index < this.businesses.length - 1 ? index + 1 : 0;
    this.currentBusiness = this.businesses[index];
  }

  onSwipeRight() {
    let index = this.getCurrentBusinessIndex(this.currentBusiness);
    index = index > 0 ? index - 1 : this.businesses.length - 1;
    this.currentBusiness = this.businesses[index];
  }

  ngOnDestroy(): void {
  }
}
