import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin } from 'rxjs';
import { BusinessEvent } from '../../../core/shared/business-event';
import { BusinessPhoto } from '../../../core/shared/business-photo.model';
import { untilComponentDestroyed } from '../../../shared/componentDestroyed';
import { Business } from '../../../core/shared/business.model';
import { BusinessService } from '../../../core/business.service';
import { Constants } from '../../../shared/constants';

@Component({
  selector: 'kz-event-detail-business-user',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss', '../../business-user.scss'],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  roles = Constants.Roles;
  event: BusinessEvent;
  business: Business;

  constructor(private route: ActivatedRoute, private businessService: BusinessService, private router: Router, private spinner: NgxUiLoaderService, private toast: ToastrService) {
  }

  ngOnInit() {
    const businessId = +this.route.snapshot.paramMap.get('id');
    const eventId = +this.route.snapshot.paramMap.get('eventId');
    this.spinner.start();
    forkJoin(this.businessService
      .getEvent(businessId, eventId), this.businessService
      .getBusinessById(businessId))
      .pipe(untilComponentDestroyed(this))
      .subscribe(([event, business]) => {
        this.event = event;
        this.business = business;
        this.spinner.stop();
      }, () => {
        this.spinner.stop();
      });
  }

  onEventEdit() {
    this.router.navigate(['/businesses', this.business.id, 'events', this.event.id, 'edit']);
  }

  addPhotos(pictures: File[]) {
    this.spinner.startLoader('add-photo');

    for (let i = 0; i < pictures.length; i++) {
      this.businessService.uploadBusinessPicture(pictures[i])
        .subscribe((url) => {
            this.businessService.uploadEventPhoto(this.business.id, this.event.id, { url: url })
              .subscribe((photo: BusinessPhoto) => {
                if (i === pictures.length - 1) {
                  this.spinner.stopLoader('add-photo');
                }
                this.router.navigate(['/businesses', this.business.id, 'events', this.event.id, 'photos']);
              });
          },
          err => {
            if (i === pictures.length - 1) {
              this.spinner.stopLoader('add-photo');
            }
            const message = err.error.message || err.message;
            this.toast.error(message);
          },
        );
    }
  }

  ngOnDestroy(): void {
  }
}
