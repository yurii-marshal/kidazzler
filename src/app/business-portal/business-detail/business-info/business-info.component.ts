import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Business } from '../../../core/shared/business.model';
import { BusinessDirection } from '../../../core/shared/enums/business-direction.enum';
import { BusinessService } from '../../../core/business.service';
import { UserRole } from '../../../core/shared/enums/user-role.enum';
import { PhoneInfo } from '../../../core/shared/phone-info';
import { UserService } from '../../../core/user.service';
import { UserProfile } from '../../../user/shared/user-profile.model';

@Component({
  selector: 'kz-business-info',
  templateUrl: './business-info.component.html',
  styleUrls: ['./business-info.component.scss'],
})
export class BusinessInfoComponent implements OnInit {
  @Input() business: Business;
  @Input() profile: UserProfile;
  UserRole = UserRole;
  isOpen: boolean = false;
  startDate: boolean | string;
  endDate: boolean | string;
  isEmptyHours: any;
  phoneInfo$: Observable<PhoneInfo>;

  constructor(private businessService: BusinessService, private spinner: NgxUiLoaderService, private userService: UserService) {
  }

  ngOnInit() {
    this.isOpen = this.businessService.isOpen(this.business.workingHours).opened;
    this.startDate = this.businessService.isOpen(this.business.workingHours).start;
    this.endDate = this.businessService.isOpen(this.business.workingHours).end;
    this.isEmptyHours = Object['values'](this.business.workingHours).every(x => x === null);
    this.phoneInfo$ = this.userService
      .getProfile()
      .pipe(map(profile => ({ code: profile.phoneCode, mask: profile.phoneMask })));
  }

  get isPhysical(): boolean {
    return this.business.businessDirection === BusinessDirection.Physical;
  }



  rate(rating) {
    if (!this.business.userRating) {
      this.spinner.startLoader('rating');
      this.businessService.rateBusiness(this.business.id, rating).subscribe(
        result => {
          this.business.rating = result.rating;
          this.business.userRating = rating;
        },
        () => {
        },
        () => {
          this.spinner.stopLoader('rating');
        },
      );
    }
  }
}
