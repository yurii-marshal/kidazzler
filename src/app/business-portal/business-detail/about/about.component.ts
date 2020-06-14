import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../../../core/account.service';
import { BusinessService } from '../../../core/business.service';
import { BusinessPhoto } from '../../../core/shared/business-photo.model';
import { Business } from '../../../core/shared/business.model';
import { PhoneInfo } from '../../../core/shared/phone-info';
import { UserService } from '../../../core/user.service';
import { untilComponentDestroyed } from '../../../shared/componentDestroyed';
import { ClipboardService } from 'ngx-clipboard';
import { environment } from '../../../../environments/environment';
import { UserRole } from '../../../core/shared/enums/user-role.enum';
import { SessionService } from '../../../core/session.service';

@Component({
  selector: 'kz-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit, OnDestroy {
  @Input() business: Business;
  @Input() photos: BusinessPhoto[];
  businesses = [];
  isShownClaimPopup: boolean;
  isShownSharePopup: boolean;
  externalLinkToBusiness: string;
  isOpen: boolean;
  startDate: boolean | string;
  endDate: boolean | string;
  isEmptyHours: any;
  phoneInfo: any;
  showPhone: boolean = false;

  isMobile: boolean;
  isBusinessUser: boolean;
  showAbout: boolean = false;

  constructor(
    private businessService: BusinessService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxUiLoaderService,
    private accountService: AccountService,
    private userService: UserService,
    private clipboardService: ClipboardService,
  ) {
  }

  async ngOnInit() {
    this.externalLinkToBusiness = `${environment.url}/business-portal/business/${this.business.id}`;
    this.isOpen = this.businessService.isOpen(this.business.workingHours).opened;
    this.startDate = this.businessService.isOpen(this.business.workingHours).start;
    this.endDate = this.businessService.isOpen(this.business.workingHours).end;
    this.isEmptyHours = Object['values'](this.business.workingHours).every(x => x === null);

    // TODO: handle if user isn't logged in
    this.userService
      .getProfile()
      .pipe(untilComponentDestroyed(this)).subscribe((profile) => {
      this.isBusinessUser = profile.role === UserRole.Business;
      this.phoneInfo = { code: profile.phoneCode, mask: profile.phoneMask };
      this.showPhone = true;
    });
  }

  copyLink(): void {
    this.clipboardService.copyFromContent(this.externalLinkToBusiness);
    this.toastr.success('Link was successfully copied');
  }

  uploadPhoto(event): void {
    const pictureInput = event.target;

    if (!pictureInput.files) {
      return;
    }

    const pictures: File[] = pictureInput.files;
    this.spinner.startLoader('upload-business-photo');

    for (let i = 0; i < pictures.length; i++) {
      this.businessService.uploadBusinessPicture(pictures[i])
        .subscribe((url) => {
            this.businessService.uploadBusinessPhoto(this.business.id, { url: url })
              .subscribe(() => {
                if (i === pictures.length - 1) {
                  pictureInput.value = '';
                  this.spinner.stopLoader('upload-business-photo');
                  this.router.navigate(['/business-portal/business', this.business.id, 'photos']);
                }
              });
          },
          err => {
            if (i === pictures.length - 1) {
              pictureInput.value = '';
              this.spinner.stopLoader('upload-business-photo');
            }
            let message = 'Error uploading picture';
            if (err instanceof HttpErrorResponse) {
              message = err.error.message || err.message;
            }
            this.toastr.error(message);
          },
        );
    }
  }

  claimBusiness() {
    if (this.isBusinessUser) {
      this.router.navigate(['../../claim-business', this.business.id]);
    }

    // this.toastr.warning('Please, sign in as Business User');
    //
    // this.router.navigate(['../../login/business', {
    //   queryParams: { id: this.business.id },
    // },
    // ]);

    // this.isShownClaimPopup = true;
  }

  closeAbout() {
    this.showAbout = false;
  }

  openWebSite(url) {
    window.open(url, '_blank');
  }

  closePopup(): void {
    this.isShownClaimPopup = false;
    this.businessService
      .sendClaimingEmail(this.business.id)
      .pipe(untilComponentDestroyed(this))
      .subscribe();
  }

  ngOnDestroy(): void {
  }
}
