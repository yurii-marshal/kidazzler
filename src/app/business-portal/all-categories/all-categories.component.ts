import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BusinessPortalService } from '../../core/business-portal.service';
import { BusinessType } from '../../core/shared/business-type.model';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';

interface AppWindow extends Window {
  postAppMessage(message: any): void;
}

declare let window: AppWindow;

@Component({
  selector: 'kz-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.scss', '../business-portal.scss'],
})
export class AllCategoriesComponent implements OnInit, OnDestroy {
  category: BusinessType;
  categories: BusinessType[];

  constructor(
    private route: ActivatedRoute,
    private businessPortalService: BusinessPortalService,
    private spinner: NgxUiLoaderService,
  ) {}

  ngOnInit() {
    const categoryId = this.route.snapshot.queryParams['category'];

    if (categoryId) {
      this.spinner.start();
      this.businessPortalService
        .getCategory(categoryId)
        .pipe(untilComponentDestroyed(this))
        .subscribe(
          (response: BusinessType) => {
            this.categories = response.subCategories;
            this.category = response;
          },
          () => {},
          () => {
            this.spinner.stop();
            // post message for mobile app
            setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 1200);
          },
        );
    } else {
      this.spinner.start();
      this.businessPortalService
        .getCategories({ level: 0, limit: 100000 })
        .pipe(untilComponentDestroyed(this))
        .subscribe(
          (response: BusinessType[]) => (this.categories = response),
          () => {},
          () => {
            this.spinner.stop();
          },
        );
    }
  }

  ngOnDestroy(): void {}
}
