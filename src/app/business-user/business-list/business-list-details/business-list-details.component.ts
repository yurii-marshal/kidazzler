import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { map } from 'rxjs/operators';
import { Business } from '../../../core/shared/business.model';
import { BusinessService } from '../../../core/business.service';
import { PhoneInfo } from '../../../core/shared/phone-info';
import { combineLatest, Observable } from 'rxjs';
import { UserService } from '../../../core/user.service';
import { BusinessPhoto } from '../../../core/shared/business-photo.model';
import { ToastrService } from 'ngx-toastr';
import { untilComponentDestroyed } from '../../../shared/componentDestroyed';
import { DOCUMENT } from '@angular/common';

const BUSINESS_IMAGE_URI = '/assets/images/icons/business-card_placeholder-image.svg';

@Component({
  selector: 'kz-business-list-details',
  templateUrl: './business-list-details.component.html',
  styleUrls: ['./business-list-details.component.scss', '../../business-user.scss'],
})
export class BusinessListDetailsComponent implements OnInit, OnDestroy {
  selectedFiles;
  phoneInfo: PhoneInfo;
  business: Business;
  pageHeader = 'Business Details';
  hoursHeader = 'Open Hours';
  areWorkdaysEmpty: boolean;
  phoneInfo$: Observable<PhoneInfo>;
  businessId: number;

  photos: BusinessPhoto[] = [];
  isMobile: boolean;

  deals = [];
  events = [];

  isOpen: boolean;
  startDate: boolean | string;
  endDate: boolean | string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private businessService: BusinessService,
    private spinner: NgxUiLoaderService,
    private userService: UserService,
    private toastr: ToastrService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any,
  ) {
  }

  ngOnInit() {
    const scrollingElement = this.document.scrollingElement || this.document.documentElement;
    this.renderer.setProperty(scrollingElement, 'scrollTop', 0);

    this.isMobile = this.userService.isMobile();

    this.phoneInfo$ = this.userService
      .getProfile()
      .pipe(map(profile => ({ code: profile.phoneCode, mask: profile.phoneMask })));

    this.businessId = +this.route.snapshot.paramMap.get('id');

    this.spinner.start();

    this.businessService.getBusinessById(this.businessId)
      .subscribe((business) => {
        this.business = business;

        this.startDate = this.businessService.isOpen(this.business.workingHours).start;
        this.endDate = this.businessService.isOpen(this.business.workingHours).end;
        this.isOpen = this.businessService.isOpen(this.business.workingHours).opened;

        if (!this.business.primaryPhoto) {
          this.business.primaryPhoto = { url: BUSINESS_IMAGE_URI } as BusinessPhoto;
        }

        this.areWorkdaysEmpty = Object.keys(this.business.workingHours).every(x => this.business.workingHours[x] === null);

        this.businessService.getPhoneInfo(this.business.country).subscribe(
          phone => {
            this.phoneInfo = phone;
            this.spinner.stop();
          },
          () => {
            this.spinner.stop();
          },
        );

        combineLatest(
          this.businessService.getEvents(this.business.id),
          this.businessService.getDeals(this.business.id),
        )
          .pipe(untilComponentDestroyed(this))
          .subscribe(([events, deals]) => {
            this.events = events;
            this.deals = deals;
          });

        if (!this.isMobile) {
          this.businessService.getBusinessPhotos(this.businessId, {
            offset: 1,
            limit: 4,
          }).subscribe(({ items }) => {
            this.photos = items;
          });
        }

      }, (err) => {
        this.spinner.stop();
        const message = err.error.message || err.message;
        this.toastr.error(message);
      }, () => {
      });
  }

  seeAllImages() {
    this.router.navigate(['businesses', this.business.id, 'photos']);
  }

  openWebSite(url) {
    window.open(url, '_blank');
  }

  onFileSelected(event) {
    this.selectedFiles = event.target.files;
    this.spinner.startLoader('upload-picture');

    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.businessService.uploadBusinessPicture(this.selectedFiles[i])
        .subscribe((url) => {
            this.businessService.uploadBusinessPhoto(this.businessId, { url: url })
              .subscribe((photo: BusinessPhoto) => {
                this.photos.unshift(photo);
                this.photos = [...this.photos];
                if (i === this.selectedFiles.length - 1) {
                  this.business.primaryPhoto = { url: this.photos[0].url } as BusinessPhoto;
                  event.target.value = '';
                  this.spinner.stopLoader('upload-picture');
                  this.router.navigate(['businesses', this.business.id, 'photos']);
                }
              });
          },
          err => {
            if (i === this.selectedFiles.length - 1) {
              this.spinner.stopLoader('upload-picture');
            }
            this.toastr.error('Server error');
          },
        );
    }
  }

  onEditBusiness() {
    this.router.navigate(['businesses', this.business.id, 'edit']);
  }

  ngOnDestroy() {
  }
}
