import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BusinessService } from '../../../core/business.service';
import { BusinessEvent } from '../../../core/shared/business-event';
import { Business } from '../../../core/shared/business.model';
import { untilComponentDestroyed } from '../../../shared/componentDestroyed';
import { Constants } from '../../../shared/constants';

interface AppWindow extends Window {
  postAppMessage(message: any): void;
}

declare let window: AppWindow;

@Component({
  selector: 'kz-event-list-on-portal',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss', '../../business-portal.scss'],
})
export class EventListComponent implements OnInit, OnDestroy {
  events: any;
  business: Business;
  pagination = new BehaviorSubject<{ first: number; rows: number }>({ first: 0, rows: 20 });
  roles = Constants.Roles;

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxUiLoaderService,
  ) {}

  ngOnInit() {
    this.spinner.start();
    const id = +this.route.snapshot.paramMap.get('id');
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
        (events: BusinessEvent[]) => {
          this.events = events;
          this.spinner.stop();
          // post message for mobile app
          setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 1200);
        },
        () => {
          this.spinner.stop();
          // post message for mobile app
          setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 1200);
        },
        () => {
        },
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
