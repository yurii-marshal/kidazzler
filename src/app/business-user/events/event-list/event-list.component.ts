import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BusinessService } from '../../../core/business.service';
import { BusinessEvent } from '../../../core/shared/business-event';
import { untilComponentDestroyed } from '../../../shared/componentDestroyed';
import { Constants } from '../../../shared/constants';
import { Business } from '../../../core/shared/business.model';

@Component({
  selector: 'kz-event-list-business-user',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss', '../../business-user.scss'],
})
export class EventListComponent implements OnInit, OnDestroy {
  events: any;
  pagination = new BehaviorSubject<{ first: number; rows: number }>({ first: 0, rows: 20 });
  roles = Constants.Roles;
  business: Business;

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxUiLoaderService,
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.spinner.start();
    this.businessService
      .getBusinessById(id)
      .pipe(untilComponentDestroyed(this))
      .subscribe(business => {
        this.business = business;
      });
    this.pagination
      .pipe(
        untilComponentDestroyed(this),
        switchMap((event: any) =>
          this.businessService.getEvents(id, {
            offset: event.first,
            limit: event.rows,
          }),
        ),
      )
      .subscribe(
        (events: any) => {
          this.events = events;
          this.spinner.stop();
        },
        () => {
          this.spinner.stop();
        },
        () => {},
      );
  }

  getAddress(type: string, event: BusinessEvent): string {
    return type === 'online'
      ? `${event.city}, ${event.state}`
      : `${event.address}, ${event.city}, ${event.state}, ${event.zip}`;
  }

  onPagination(event) {
    this.pagination.next(event);
  }

  ngOnDestroy(): void {}
}
