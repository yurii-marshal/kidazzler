import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BusinessService } from '../../../core/business.service';
import { BusinessEvent } from '../../../core/shared/business-event';
import { untilComponentDestroyed } from '../../../shared/componentDestroyed';

@Component({
  selector: 'kz-event-business-user',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss', '../../business-user.scss'],
})
export class EventComponent implements OnInit, OnDestroy {
  eventId: number;
  businessId: number;
  event: BusinessEvent = {};

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private location: Location,
    private spinner: NgxUiLoaderService,
    private router: Router,
    private toast: ToastrService,
  ) {
  }

  ngOnInit() {
    this.eventId = +this.route.snapshot.paramMap.get('eventId');
    this.businessId = +this.route.snapshot.paramMap.get('id');
  }


  onDelete() {
    this.businessService.deleteEvent(this.businessId, this.eventId)
      .subscribe(() => {
        this.location.back();
      }, (err) => {
        const message = err.error.message || err.message;
        this.toast.error(message);
      });
  }

  submit(form): void {
    if (this.eventId) {
      this.spinner.startLoader('submit-event');
      this.businessService
        .editEvent(this.businessId, this.eventId, form)
        .pipe(untilComponentDestroyed(this))
        .subscribe(
          () => {
            this.spinner.stopLoader('submit-event');
            this.router.navigate(['..'], { relativeTo: this.route });
          },
          () => {
            this.spinner.stopLoader('submit-event');
          },
          () => {
            this.spinner.stopLoader('submit-event');
          },
        );
    } else {
      this.businessService
        .addEvent(this.businessId, form)
        .pipe(untilComponentDestroyed(this))
        .subscribe(
          () => {
            this.spinner.stopLoader('submit-event');
            this.router.navigate(['..'], { relativeTo: this.route });
          },
          () => {
            this.spinner.stopLoader('submit-event');
          },
          () => {
            this.spinner.stopLoader('submit-event');
          },
        );
    }
  }

  ngOnDestroy(): void {
  }
}
