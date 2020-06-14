import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { switchMap } from 'rxjs/operators';
import { BusinessService } from '../../core/business.service';
import { BusinessPhoto } from '../../core/shared/business-photo.model';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';
import { Constants } from '../../shared/constants';
import { forkJoin } from 'rxjs';

interface AppWindow extends Window {
  postAppMessage(message: any): void;
}

declare let window: AppWindow;

@Component({
  selector: 'kz-business-photos',
  templateUrl: './business-photos.component.html',
  styleUrls: ['./business-photos.component.scss', '../business-portal.scss'],
})
export class BusinessPhotosComponent implements OnInit, OnDestroy {
  roles = Constants.Roles;
  businessId: number;
  photos: BusinessPhoto[];

  constructor(private route: ActivatedRoute, private spinner: NgxUiLoaderService, private businessService: BusinessService, private toast: ToastrService) {
  }

  ngOnInit() {
    this.businessId = +this.route.snapshot.paramMap.get('id');
    this.spinner.start();
    this.businessService.getBusinessPhotos(this.businessId).pipe(untilComponentDestroyed(this))
      .subscribe(({ items }) => {
        this.photos = items;
        this.spinner.stop();
        // post message for mobile app
        setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 500);
      }, (err) => {
        this.spinner.stop();
        // post message for mobile app
        setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 500);
        const message = err.error.message || err.message;
        this.toast.error(message);
      }, () => {
      });
  }

  addPhotos(pictures) {
    this.spinner.startLoader('add-photo');

    for (let i = 0; i < pictures.length; i++) {
      console.log(pictures[i]);
      setTimeout(() => {
        this.businessService.uploadBusinessPicture(pictures[i])
          .subscribe((url) => {
              this.businessService.uploadBusinessPhoto(this.businessId, { url: url })
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
      }, 100);
    }
  }

  ngOnDestroy(): void {
  }
}
