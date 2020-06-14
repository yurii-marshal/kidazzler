import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { switchMap } from 'rxjs/operators';
import { BusinessService } from '../../core/business.service';
import { BusinessPhoto } from '../../core/shared/business-photo.model';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';
import { Constants } from '../../shared/constants';
import { UserService } from '../../core/user.service';
import { forkJoin, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'kz-business-photos',
  templateUrl: './business-photos.component.html',
  styleUrls: ['./business-photos.component.scss', '../business-user.scss'],
})
export class BusinessPhotosComponent implements OnInit, OnDestroy {
  roles = Constants.Roles;
  businessId: number;
  photos: BusinessPhoto[];
  showAllTab: boolean;

  isLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private spinner: NgxUiLoaderService,
    private businessService: BusinessService,
    private toast: ToastrService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.showAllTab = this.userService.isMobile() === false;
    this.businessId = +this.route.snapshot.paramMap.get('id');
    this.spinner.start();
    this.isLoading = true;
    this.businessService.getBusinessPhotos(this.businessId).pipe(untilComponentDestroyed(this))
      .subscribe(({ items }) => {
        this.photos = items;
        this.spinner.stop();
        this.isLoading = false;
      }, (err) => {
        this.spinner.stop();
        this.isLoading = false;
        const message = err.error.message || err.message;
        this.toast.error(message);
      }, () => {
      });
  }

  deletePhoto(photo: BusinessPhoto) {
    this.isLoading = true;
    this.spinner.startLoader('delete-photo');
    this.businessService.deleteBusinessPhoto(this.businessId, photo.id)
      .subscribe(() => {
        this.deletePhotoFromArray(photo.id);
        this.photos = [...this.photos];
        this.spinner.stopLoader('delete-photo');
        this.isLoading = false;
      }, (err) => {
        this.spinner.stopLoader('delete-photo');
        this.isLoading = false;
        const message = err.error.message || err.message;
        this.toast.error(message);
      });
  }

  addPhotos(pictures: File[]) {
    this.spinner.startLoader('add-photo');
    this.isLoading = true;

    for (let i = 0; i < pictures.length; i++) {
      this.businessService.uploadBusinessPicture(pictures[i])
        .subscribe((url) => {
            this.businessService.uploadBusinessPhoto(this.businessId, { url: url })
              .subscribe((photo: BusinessPhoto) => {
                this.photos.unshift(photo);
                this.photos = [...this.photos];
                if (i === pictures.length - 1) {
                  this.spinner.stopLoader('add-photo');
                  this.isLoading = false;
                }
              });
          },
          err => {
            if (i === pictures.length - 1) {
              this.spinner.stopLoader('add-photo');
              this.isLoading = false;
            }
            const message = err.error.message || err.message;
            this.toast.error(message);
          },
        );
    }

    // this.businessService.uploadBusinessPicture(pictures).pipe(
    //   switchMap((urlList) => {
    //     const obs = [];
    //     urlList.forEach((url) => {
    //       obs.push(this.businessService.uploadBusinessPhoto(this.businessId, { url: url }));
    //     });
    //
    //     return forkJoin(obs);
    //   }),
    //   untilComponentDestroyed(this),
    // ).subscribe((photos: BusinessPhoto[]) => {
    //   this.photos.unshift(...photos);
    //   this.photos = [...this.photos];
    //   this.spinner.stopLoader('add-photo');
    //   this.isLoading = false;
    // }, (err) => {
    //   this.spinner.stopLoader('add-photo');
    //   this.isLoading = false;
    //   const message = err.error.message || err.message;
    //   this.toast.error(message);
    // });
  }

  makePrimary(photo: BusinessPhoto) {
    this.isLoading = true;
    this.spinner.startLoader('make-primary');
    this.businessService.makePrimaryPhoto(this.businessId, { primaryPhoto: photo.id })
      .subscribe(() => {
        this.spinner.stopLoader('make-primary');
        this.isLoading = false;
        this.photos.map(el => el.primary = photo.id === el.id);
        this.photos = [...this.photos];
      }, (err) => {
        this.spinner.stopLoader('make-primary');
        this.isLoading = false;
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
