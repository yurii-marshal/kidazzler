import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { BusinessService } from '../../../core/business.service';
import { BusinessEvent } from '../../../core/shared/business-event';
import { Business } from '../../../core/shared/business.model';
import { Constants } from '../../../shared/constants';

interface AppWindow extends Window {
  postAppMessage(message: any): void;
}

declare let window: AppWindow;

@Component({
  selector: 'kz-event-detail-on-portal',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss', '../../business-portal.scss'],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  roles = Constants.Roles;
  event: BusinessEvent;
  business: Business;

  constructor(private route: ActivatedRoute, private businessService: BusinessService, private location: Location, private router: Router) {
  }

  ngOnInit() {
    const businessId = +this.route.snapshot.paramMap.get('id');
    const eventId = +this.route.snapshot.paramMap.get('eventId');
    combineLatest(this.businessService
      .getEvent(businessId, eventId), this.businessService.getBusinessById(businessId))
      .subscribe(([event, business]) => {
        this.event = event;
        this.business = business;
        // post message for mobile app
        setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 1200);
      }, (err) => {
        // post message for mobile app
        setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 1200);
      });
  }

  goBack() {
    this.router.navigate([this.router.url.replace(/[^\/]+$/, '')]);
  }

  ngOnDestroy(): void {
  }
}
