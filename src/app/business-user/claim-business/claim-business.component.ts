import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BusinessService } from '../../core/business.service';
import { SessionService } from '../../core/session.service';
import { Business } from '../../core/shared/business.model';
import { PhoneInfo } from '../../core/shared/phone-info';
import { UserService } from '../../core/user.service';
import { UserProfile } from '../../user/shared/user-profile.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';

export interface BusinessSignup {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmationPassword: string;
  claimingToken: String;
}

@Component({
  selector: 'kz-claim-business',
  templateUrl: './claim-business.component.html',
  styleUrls: ['./claim-business.component.scss', '../business-user.scss'],
})

export class ClaimBusinessComponent implements OnInit {
  business: Business;
  businessId: number;
  claimingToken: string;
  phoneInfo: PhoneInfo;
  user: UserProfile;
  twilioClient: any;
  isPhysical: boolean;

  DEFAULT_BUSINESS_PHOTO = '/assets/images/notifications/business-placeholder/business-placeholder.png';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private businessService: BusinessService,
    private sessionService: SessionService,
    private toastr: ToastrService,
    private userService: UserService,
    private spinner: NgxUiLoaderService,
  ) {
  }

  ngOnInit() {
    this.claimingToken = this.activatedRoute.snapshot.queryParams['token'];
    this.businessId = this.activatedRoute.snapshot.params['id'];

    const isClaimingTime = new Date().getTime() < Number(localStorage.getItem('claim-timeout')) + 60000;

    if (isClaimingTime) {
      this.router.navigate(['../enter-code', this.businessId]);
    } else {
      this.spinner.startLoader('claim-business');

      this.businessService.getBusinessById(Number(this.businessId))
        .subscribe((data) => {
          this.business = data;

          this.isPhysical = this.business.businessDirection === 'Physical';

          if (this.business.isClaimed) {
            this.toastr.error('This business is already claimed!');
            this.router.navigate(['business-portal']);
          } else {
            localStorage.setItem('business-phone', this.business.phone);
            localStorage.setItem('business-email', this.business.email);
            localStorage.setItem('business-country', this.business.country);
            localStorage.setItem('business-id', this.business.id.toString());
          }

          this.businessService.getPhoneInfo(this.business.country)
            .subscribe((phoneInfo) => {
              this.phoneInfo = phoneInfo;
            });
          this.spinner.stopLoader('claim-business');
        }, (error) => {
          this.toastr.error('404 Not found');
          this.spinner.stopLoader('claim-business');
          this.router.navigate(['businesses']);
        });
    }
  }

  verifyClaimBusiness(type) {
    this.spinner.startLoader('claim-business');
    this.businessService.setClaimBusinessVerification(this.businessId, {
      type: type,
    })
      .subscribe(() => {
        if (type === 'sms') {
          this.toastr.success('We have sent message to this business phone number');
        } else {
          this.toastr.success('We will call to the business phone number soon');
        }
        this.spinner.stopLoader('claim-business');
        this.router.navigate(['enter-code', this.businessId]);
      }, (error) => {
        this.toastr.error(error.message);
        this.spinner.stopLoader('claim-business');
      });
  }
}
