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
  selector: 'kz-deal-photos',
  templateUrl: './deal-photos.component.html',
  styleUrls: ['./deal-photos.component.scss', '../../business-user.scss'],
})
export class DealPhotosComponent implements OnInit, OnDestroy {
  roles = Constants.Roles;
  businessId: number;
  dealId: number;
  photos: BusinessPhoto[];

  constructor(private route: ActivatedRoute, private spinner: NgxUiLoaderService, private businessService: BusinessService, private toast: ToastrService) {
  }

  ngOnInit() {
    this.businessId = +this.route.snapshot.paramMap.get('id');
    this.dealId = +this.route.snapshot.paramMap.get('dealId');
    this.spinner.start();
    this.businessService.getDealPhotos(this.businessId, this.dealId).pipe(untilComponentDestroyed(this))
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
    this.businessService.deleteDealPhoto(this.businessId, this.dealId, photo.id)
      .subscribe(() => {
        this.spinner.stopLoader('delete-photo');
        this.deletePhotoFromArray(photo.id);
        this.photos = [...this.photos];
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
            this.businessService.uploadDealPhoto(this.businessId, this.dealId, { url: url })
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
    this.businessService.makePrimaryDealsPhoto(this.businessId, this.dealId, { primaryPhoto: photo.id })
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
