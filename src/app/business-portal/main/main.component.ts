import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { combineLatest } from 'rxjs';
import { BusinessPortalService } from '../../core/business-portal.service';
import { BusinessType } from '../../core/shared/business-type.model';
import { Business } from '../../core/shared/business.model';
import { UserService } from '../../core/user.service';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';
import { UserProfile } from '../../user/shared/user-profile.model';
import { Slide } from './slider/shared/slide';

interface AppWindow extends Window {
  postAppMessage(message: any): void;
}

declare let window: AppWindow;

@Component({
  selector: 'kz-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss', '../business-portal.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit, OnDestroy {
  categories: BusinessType[];
  businesses: Business[];
  bestCategories: any[];
  slides: Slide[];
  profile: UserProfile;

  constructor(
    private businessPortalService: BusinessPortalService,
    private userService: UserService,
    private spinner: NgxUiLoaderService,
  ) {}

  ngOnInit() {
    this.spinner.start();
    combineLatest(
      this.userService.getProfile().pipe(
        untilComponentDestroyed(this),
        switchMap((profile: UserProfile) => {
          this.profile = profile;
          return profile.city
            ? this.businessPortalService.getBestCategories({
                state: profile.state,
                city: profile.city,
                country: profile.country,
              limitBusinesses: 8,
              })
            : of([]);
        }),
      ),
      this.businessPortalService.getCategories({
        limit: 8,
        level: 0,
      }),
      this.businessPortalService.getSliderImages(),
    )
      .pipe(untilComponentDestroyed(this))
      .subscribe(
        ([bestCategories, categories, { items }]) => {
          this.bestCategories = bestCategories.items;
          this.categories = categories;
          this.slides = items;
          this.spinner.stop();
          // post message for mobile app
          setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 1200);
        },
        () => {
          this.spinner.stop();
          // post message for mobile app
          setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 1200);
        },
      );
  }

  ngOnDestroy(): void {}

  getTitle(name: string): string {
    return `Best ${name} in ${this.profile.city}`;
  }
}
