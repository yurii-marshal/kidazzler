import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin, combineLatest, of, BehaviorSubject } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { BusinessPortalService } from '../../core/business-portal.service';
import { BusinessType } from '../../core/shared/business-type.model';
import { Business } from '../../core/shared/business.model';
import { SearchParams } from '../../core/shared/search-params';
import { UserService } from '../../core/user.service';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';
import { UserProfile } from '../../user/shared/user-profile.model';

interface AppWindow extends Window {
  postAppMessage(message: any): void;
}

declare let window: AppWindow;

@Component({
  selector: 'kz-sub-categories',
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.scss', '../business-portal.scss'],
})
export class SubCategoriesComponent implements OnInit, OnDestroy {
  category: BusinessType;
  business: Business;
  businesses: any;

  profile: UserProfile;
  firstBusinessesPart: Business[] = [];
  secondBusinessesPart: Business[] = [];
  currentLocation: any;
  params: SearchParams = {};
  paginationParams: any = {};
  showMore: boolean = false;
  pagination = new BehaviorSubject({ first: 0, rows: 20 });
  loadingBusinesses: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private businessPortalService: BusinessPortalService,
    private userService: UserService,
    private spinner: NgxUiLoaderService,
  ) {
  }

  ngOnInit() {
    this.currentLocation = this.route.snapshot.queryParams['currentLocation'] || null;
    if (!this.currentLocation) {
      this.params.nearby = true;
    } else {
      delete this.params.nearby;
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
    this.userService.getProfile().pipe(untilComponentDestroyed(this)).subscribe((profile) => {
      this.profile = profile;
    });

    this.route.params.pipe(
      switchMap(({ id }) => {
        this.spinner.start();
        return this.businessPortalService.getCategory(id).pipe(
          switchMap((category: BusinessType) => {
            this.params.category = category.id;
            this.category = category;
            return category.level < 1 ? this.pagination.pipe(
              switchMap((paginationParams: any) => {
                  this.loadingBusinesses = true;
                  return this.businessPortalService.getBusinesses(Object.assign(paginationParams, this.params));
                },
              ),
              untilComponentDestroyed(this)) : of([]);
          }),
          untilComponentDestroyed(this),
        );
      }),
      untilComponentDestroyed(this))
      .subscribe(
        (businesses) => {
          this.loadingBusinesses = false;
          this.paginationParams.offset = businesses.offset;
          this.paginationParams.limit = businesses.limit;
          this.spinner.stop();
          if (this.category.level === 0) {
            this.category.subCategories = this.category.subCategories.slice(0, 8);
          }

          this.businesses = businesses;
          if (!this.category.subCategories.length) {
            this.params.category = this.category.id;
            this.params.level = this.category.level;
            this.router.navigate(['/business-portal/search-result'], {
              queryParams: this.params,
            });
          }

          if (businesses.items && businesses.items.length > 2) {
            if (!this.paginationParams.offset) {
              this.firstBusinessesPart = businesses.items.splice(0, 2);
            }
            this.secondBusinessesPart = this.secondBusinessesPart.concat(businesses.items);
          } else {
            if (this.firstBusinessesPart.length) {
              this.secondBusinessesPart = this.secondBusinessesPart.concat(businesses.items);
            } else {
              this.firstBusinessesPart = this.firstBusinessesPart.concat(businesses.items);
              this.secondBusinessesPart = [];

            }
          }
          this.showMore = this.businesses.count - (this.firstBusinessesPart.length + this.secondBusinessesPart.length) > 0;
          // post message for mobile app
          setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 1200);
        },
        () => {
          this.loadingBusinesses = false;
          this.spinner.stop();
          // post message for mobile app
          setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 1200);
        },
      );
  }

  getMoreBusinesses() {
    this.paginationParams.offset = this.paginationParams.offset + this.paginationParams.limit;
    this.pagination.next(this.paginationParams);
  }


  goToSearchResult(category) {
    this.params.category = category.id;
    this.router.navigate(['/business-portal/search-result'], {
      queryParams: { ...this.params },
    });
  }

  goToMapSearch() {
    this.params.category = this.category.id;
    this.router.navigate(['/business-portal/search-with-map'], {
      queryParams: { ...this.params },
    });
  }

  goToFilter() {
    this.params.category = this.category.id;
    this.router.navigate(['/business-portal/search-filter'], {
      queryParams: { ...this.params },
    });
  }

  ngOnDestroy() {
  }
}
