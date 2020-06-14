import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Business } from '../../../core/shared/business.model';
import { PhoneInfo } from '../../../core/shared/phone-info';
import { BusinessService } from '../../../core/business.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from '../../../core/user.service';
import { BusinessPhoto } from '../../../core/shared/business-photo.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kz-business-list-card',
  templateUrl: './business-list-card.component.html',
  styleUrls: ['./business-list-card.component.scss', '../../business-user.scss'],
})
export class BusinessListCardComponent implements OnInit {
  hasDealsNotifications: false;
  hasEventsNotifications: false;
  @Input() data: Business;
  phoneInfo$: Observable<PhoneInfo>;

  isMobile: boolean;
  BUSINESS_IMAGE_URI = '/assets/images/icons/business-card_placeholder-image.svg';

  isCheckInDialogOpened: boolean;
  isEditCheckInDialogOpened: boolean;

  constructor(
    private spinner: NgxUiLoaderService,
    private router: Router,
    private businessService: BusinessService,
    private userService: UserService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.isMobile = this.userService.isMobile();
    this.phoneInfo$ = this.userService
      .getProfile()
      .pipe(map(profile => ({ code: profile.phoneCode, mask: profile.phoneMask })));
  }

  onFileSelected(event) {
    this.spinner.startLoader('upload-picture-on-card' + this.data.id);

    const pictures: File[] = event.target.files;

    for (let i = 0; i < pictures.length; i++) {
      this.businessService.uploadBusinessPicture(pictures[i])
        .subscribe((url) => {
            this.businessService.uploadBusinessPhoto(this.data.id, { url: url })
              .subscribe((photo: BusinessPhoto) => {
                if (i === pictures.length - 1) {
                  event.target.value = '';
                  this.spinner.stopLoader('upload-picture-on-card' + this.data.id);
                  this.router.navigate(['businesses', this.data.id, 'photos']);
                }
              });
          },
          err => {
            if (i === pictures.length - 1) {
              this.spinner.stopLoader('upload-picture-on-card' + this.data.id);
            }
            this.toastr.error('Server error');
          },
        );
    }
  }

  upgradeBusiness() {
    this.router.navigate(['upgrade-business', this.data.id]);
  }

  seeAllImages() {
    this.router.navigate(['businesses', this.data.id, 'photos']);
  }

  openWebSite(url) {
    window.open(url, '_blank');
  }

  checkinCode() {
    if (this.data.isClaimed) {
      this.isMobile ? this.router.navigate([
        'businesses',
        this.data.id,
        'checkin-code',
        {
          code: this.data['checkInCode'] || '',
          count: this.data['checkInsCount'] || 0,
          createdAt: this.data['checkInCodeGeneratedAt'] || '',
        },
      ]) : this.isCheckInDialogOpened = true;
    } else {
      this.toastr.error('At first, you should claim this business');
    }
  }

  onCheckinCodeClose(ev) {
    if (!this.isMobile) {
      this.isCheckInDialogOpened = !ev;
      this.isEditCheckInDialogOpened = ev;
    }
  }

  onCloseEditCode(ev) {
    if (!this.isMobile) {
      if (ev.code) {
        this.data.checkInCode = ev.code;
      }

      this.isEditCheckInDialogOpened = false;
      this.isCheckInDialogOpened = true;
    }
  }
}
