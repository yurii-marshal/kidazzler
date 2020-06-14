import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BusinessPortalService } from '../../core/business-portal.service';
import { BusinessType } from '../../core/shared/business-type.model';
import { Business } from '../../core/shared/business.model';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';
import { SearchParams } from '../../core/shared/search-params';

interface AppWindow extends Window {
  postAppMessage(message: any): void;
}

declare let window: AppWindow;

@Component({
  selector: 'kz-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss', '../business-portal.scss'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  category: BusinessType;
  query: string;
  resultLocation: string;
  params: SearchParams = {};
  categories: BusinessType[];
  businesses: any;
  firstBusinessesPart: Business[] = [];
  secondBusinessesPart: Business[] = [];
  level: number;
  history: any;
  paginationParams: any = {};
  loadingBusinesses: boolean = false;
  showMore: boolean = false;
  pagination = new BehaviorSubject({ first: 0, rows: 20 });

  constructor(
    private businessPortalService: BusinessPortalService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxUiLoaderService,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.pipe(untilComponentDestroyed(this))
      .subscribe((params: SearchParams) => {
        this.params = { ...params };
        delete this.params.level;
      });

    this.level = this.route.snapshot.queryParams['level'];
    if (this.params.city || this.params.state) {
      this.resultLocation = `${this.params.city}, ${this.params.state}, ${this.params.country}`;
    }
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

    const category$ = this.params.category
      ? this.businessPortalService.getCategory(this.params.category)
      : of({});
    const businesses$ = this.pagination
      .pipe(
        switchMap((paginationParams: any) => {
          this.loadingBusinesses = true;
          return this.businessPortalService.getBusinesses(Object.assign(paginationParams, this.params));
        }),
        untilComponentDestroyed(this),
      );
    this.spinner.start();

    businesses$
      .pipe(untilComponentDestroyed(this))
      .subscribe(
        (businesses) => {
          this.loadingBusinesses = false;
          this.paginationParams.offset = businesses.offset;
          this.paginationParams.limit = businesses.limit;
          this.businesses = businesses;
          if (businesses.items.length > 2) {
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
          this.spinner.stop();
        },
        () => {
          this.loadingBusinesses = false;
          this.spinner.stop();
        },
        () => {
          // post message for mobile app
          setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 1200);
        },
      );
    category$.pipe(untilComponentDestroyed(this))
      .subscribe((category) => {
        if (this.params.category) {
          this.category = category;
        }
      });
  }


  goBack(): void {
    this.history = history;
    if (this.level < 2) {
      this.history.go(-2);
    } else {
      this.history.back();
    }
  }

  getMoreBusinesses() {
    this.paginationParams.offset = this.paginationParams.offset + this.paginationParams.limit;
    this.pagination.next(this.paginationParams);
  }

  goToMapSearch() {
    this.router.navigate(['/business-portal/search-with-map'], {
      queryParams: { ...this.params },
    });
  }

  goToFilter() {
    this.router.navigate(['/business-portal/search-filter'], {
      queryParams: { ...this.params },
    });
  }

  ngOnDestroy(): void {
  }
}
