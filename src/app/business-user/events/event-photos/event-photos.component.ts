import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { switchMap } from 'rxjs/operators';
import { BusinessService } from '../../../core/business.service';
import { BusinessPhoto } from '../../../core/shared/business-photo.model';
import { untilComponentDestroyed } from '../../../shared/componentDestroyed';
import { Constants } from '../../../shared/constants';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'kz-event-photos',
  templateUrl: './event-photos.component.html',
  styleUrls: ['./event-photos.component.scss', '../../business-user.scss'],
})
export class EventPhotosComponent implements OnInit, OnDestroy {
  roles = Constants.Roles;
  businessId: number;
  eventId: number;
  photos: BusinessPhoto[];

  constructor(private route: ActivatedRoute, private spinner: NgxUiLoaderService, private businessService: BusinessService, private toast: ToastrService) {
  }

  ngOnInit() {
    this.businessId = +this.route.snapshot.paramMap.get('id');
    this.eventId = +this.route.snapshot.paramMap.get('eventId');
    this.spinner.start();
    this.businessService.getEventPhotos(this.businessId, this.eventId).pipe(untilComponentDestroyed(this))
      .subscribe(({ items }) => {
        this.photos = items;
        this.spinner.stop();
      }, (err) => {
        this.spinner.stop();
        const message = err.error.message || err.message;
        this.toast.error(message);
      }, () => {
      });
  }

  deletePhoto(photo: BusinessPhoto) {
    this.spinner.startLoader('delete-photo');
    this.businessService.deleteEventPhoto(this.businessId, this.eventId, photo.id)
      .subscribe(() => {
        this.spinner.stopLoader('delete-photo');
        this.photos = [...this.photos];
        this.deletePhotoFromArray(photo.id);
      }, (err) => {
        this.spinner.stopLoader('delete-photo');
        const message = err.error.message || err.message;
        this.toast.error(message);
      });
  }

  addPhotos(pictures: File[]) {
    this.spinner.startLoader('add-photo');

    for (let i = 0; i < pictures.length; i++) {
      this.businessService.uploadBusinessPicture(pictures[i])
        .subscribe((url) => {
            this.businessService.uploadEventPhoto(this.businessId, this.eventId, { url: url })
              .subscribe((photo: BusinessPhoto) => {
                this.photos.unshift(photo);
                this.photos = [...this.photos];
                if (i === pictures.length - 1) {
                  this.spinner.stopLoader('add-photo');
                }
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

  makePrimary(photo: BusinessPhoto) {
    this.spinner.startLoader('make-primary');
    this.businessService.makePrimaryEventsPhoto(this.businessId, this.eventId, { primaryPhoto: photo.id })
      .subscribe(() => {
        this.spinner.stopLoader('make-primary');
        this.photos.map(el => el.primary = photo.id === el.id);
        this.photos = [...this.photos];
      }, (err) => {
        this.spinner.stopLoader('make-primary');
        const message = err.error.message || err.message;
        this.toast.error(message);
      });
  }

  ngOnDestroy(): void {
  }

  private deletePhotoFromArray(photoId) {
    this.photos.splice(this.photos.findIndex(photo => photoId === photo.id), 1);
  }
}
