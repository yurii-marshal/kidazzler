import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { combineLatest, of } from 'rxjs';
import { AccountService } from '../../core/account.service';
import { BusinessService } from '../../core/business.service';
import { Business } from '../../core/shared/business.model';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';

interface AppWindow extends Window {
  postAppMessage(message: any): void;
}

declare let window: AppWindow;

@Component({
  selector: 'kz-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss', '../business-portal.scss'],
})
export class CheckInComponent implements OnInit, OnDestroy {
  isSuccessfullyCheckIn: boolean;
  isShownInfoPopup: boolean;
  isShownSharePopup: boolean;
  businessId: number;
  business: Business;
  photoUrl: any;
  isAnonymously: boolean;
  code: string;
  checkInPoints = 0;
  pointsConfig: any;
  codeFocused: boolean = false;

  externalLinkToCheckIn: string;

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService,
    private accountService: AccountService,
  ) {
  }

  async ngOnInit() {
    this.externalLinkToCheckIn = await this.accountService.getReferralSignupUrl();
    this.businessId = +this.route.snapshot.paramMap.get('id');
    this.spinner.start();
    this.accountService.getPointsInfo().subscribe((result) => {
      this.pointsConfig = result.config;
    });
    this.businessService
      .getBusinessById(this.businessId)
      .pipe(untilComponentDestroyed(this))
      .subscribe(
        response => (this.business = response),
        err => {
          let message = 'Error uploading picture';
          if (err instanceof HttpErrorResponse) {
            message = err.error.message || err.message;
          }
          this.toastr.error(message);
        },
        () => {
          // post message for mobile app
          setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 1200);
          this.spinner.stop();

        },
      );
  }

  onCodeFocus() {
    this.codeFocused = true;
  }

  onCodeBlur() {
    this.codeFocused = false;
  }

  onUploadPhoto(event): void {
    const pictureInput = event.target;

    if (!pictureInput.files || !pictureInput.files[0]) {
      return;
    }

    const pictures: File[] = pictureInput.files;
    this.spinner.startLoader('upload-img');
    try {
      this.businessService
        .uploadBusinessPicture(pictures[0])
        .pipe(untilComponentDestroyed(this))
        .subscribe(
          response => (this.photoUrl = response || ''),
          () => {
          },
          () => {
            pictureInput.value = '';
            this.spinner.stopLoader('upload-img');
          },
        );
    } catch (response) {
      let message = 'Error uploading picture';
      if (response instanceof HttpErrorResponse) {
        message = response.error.message;
      }
      this.spinner.stopLoader('upload-img');

      pictureInput.value = '';
    }
  }

  removePhoto(): void {
    this.photoUrl = '';
  }

  onSubmit(): void {
    this.spinner.startLoader('check-in');
    const checkIn$ = this.businessService.checkIn(this.businessId, { code: this.code });
    const photos$ = this.photoUrl
      ? this.businessService.uploadBusinessPhoto(this.businessId, {
        url: this.photoUrl,
        checkin: true,
        anonymous: this.isAnonymously,
      })
      : of({});
    combineLatest(checkIn$, photos$)
      .pipe(untilComponentDestroyed(this))
      .subscribe(
        ([checkIn, photos]) => {
          this.isSuccessfullyCheckIn = true;
          this.checkInPoints = (this.photoUrl ? this.pointsConfig.UPLOADED_PHOTO : 0) + (this.code ? this.pointsConfig.CHECKED_IN_CODE : this.pointsConfig.CHECKED_IN);
        },
        err => {
          const message = err.error.message || err.message;
          this.toastr.error(message);
          this.spinner.stopLoader('check-in');
        },
        () => {
          this.spinner.stopLoader('check-in');
        },
      );
  }

  shareBusiness() {
    this.isShownSharePopup = true;
  }

  goToBusinessDetail(): void {
    this.router.navigate(['/business-portal/business', this.businessId], {
        queryParams: {
          level: 1,
        },
      },
    );
  }

  ngOnDestroy(): void {
  }
}
