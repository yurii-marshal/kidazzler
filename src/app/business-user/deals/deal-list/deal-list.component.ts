import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BusinessService } from '../../../core/business.service';
import { Business } from '../../../core/shared/business.model';
import { untilComponentDestroyed } from '../../../shared/componentDestroyed';
import { Constants } from '../../../shared/constants';

@Component({
  selector: 'kz-deal-list-business-user',
  templateUrl: './deal-list.component.html',
  styleUrls: ['./deal-list.component.scss', '../../business-user.scss'],
})
export class DealListComponent implements OnInit, OnDestroy {
  deals: any;
  businessId: number;
  business: Business;
  pagination = new BehaviorSubject<{ first: number; rows: number }>({ first: 0, rows: 20 });
  roles = Constants.Roles;

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private spinner: NgxUiLoaderService,
  ) {}

  ngOnInit() {
    this.businessId = +this.route.snapshot.paramMap.get('id');
    this.spinner.start();
    this.businessService
      .getBusinessById(this.businessId)
      .pipe(untilComponentDestroyed(this))
      .subscribe(business => {
        this.business = business;
      });
    this.pagination
      .pipe(
        untilComponentDestroyed(this),
        switchMap((event: any) =>
          this.businessService.getDeals(this.businessId, {
            offset: event.first,
            limit: event.rows,
          }),
        ),
      )
      .subscribe(
        deals => {
          this.deals = deals;
          this.spinner.stop();
        },
        () => {
          this.spinner.stop();
        },
        () => {},
      );
  }

  onPagination(event) {
    this.pagination.next(event);
  }

  ngOnDestroy(): void {}
}
