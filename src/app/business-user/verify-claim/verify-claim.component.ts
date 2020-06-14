import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { BusinessService } from '../../core/business.service';
import { SessionService } from '../../core/session.service';
import { PhoneInfo } from '../../core/shared/phone-info';
import { Business } from '../../core/shared/business.model';
import { UserProfile } from '../../user/shared/user-profile.model';

@Component({
  templateUrl: './verify-claim.component.html',
  styleUrls: ['../business-user.scss']
})
export class VerifyClaimComponent implements OnInit {
  business: Business;
  claimingToken: string;
  phoneInfo: PhoneInfo;
  user: UserProfile;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private businessService: BusinessService,
    private sessionService: SessionService,
    private toastr: ToastrService,
  ) {
  }

  async ngOnInit() {
    this.claimingToken = localStorage.getItem('business-claiming-token');

    try {
      this.business = await this.businessService.getUnclaimedBusiness(this.claimingToken).toPromise();

      this.phoneInfo = await this.businessService.getPhoneInfo(this.business.country).toPromise();

      localStorage.setItem('business-email', this.business.email);
      localStorage.setItem('business-country', this.business.country);
      localStorage.setItem('business-id', this.business.id.toString());

    } catch (response) {
      if (response.status === 400) {
        this.toastr.error(response.error.message);
        this.router.navigate(['login']);
      }
    }
  }
}
