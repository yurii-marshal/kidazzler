import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { switchMap } from 'rxjs/operators';
import { BusinessService } from '../../../core/business.service';
import { BusinessEvent } from '../../../core/shared/business-event';
import { BusinessPhoto } from '../../../core/shared/business-photo.model';
import { Business } from '../../../core/shared/business.model';
import { untilComponentDestroyed } from '../../componentDestroyed';

@Component({
  selector: 'kz-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit, OnDestroy {
  @Input() event: BusinessEvent;
  @Input() business: Business;
  @Input() role: number;
  businessId: number;
  primaryPhotoUrl: string;

  constructor(private spinner: NgxUiLoaderService, private businessService: BusinessService, private route: ActivatedRoute, private toast: ToastrService) {
  }

  ngOnInit() {
    this.businessId = +this.route.snapshot.paramMap.get('id');
    const primaryPhoto = this.event.photos[this.event.photos.findIndex(el => el.primary)];
    this.primaryPhotoUrl = primaryPhoto && primaryPhoto.url || this.event.photos.length && this.event.photos[0].url || '../../../../assets/images/bg-landing.jpg';
  }

  addPhoto(event) {
    const pictureInput = event.target;

    if (!pictureInput.files || !pictureInput.files[0]) {
      return;
    }
    const pictures: File[] = pictureInput.files;

    for (let i = 0; i < pictures.length; i++) {
      this.businessService.uploadBusinessPicture(pictures[i])
        .subscribe((url) => {
            this.businessService.uploadEventPhoto(this.businessId, this.event.id, { url: url })
              .subscribe((photo: BusinessPhoto) => {
                if (i === pictures.length - 1) {
                  this.primaryPhotoUrl = photo.url;
                  pictureInput.value = '';
                }
              });
          },
          err => {
            const message = err.error.message || err.message;
            this.toast.error(message);
          },
        );
    }
  }

  ngOnDestroy(): void {
  }
}
