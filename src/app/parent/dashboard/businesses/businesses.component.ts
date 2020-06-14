import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BehaviorSubject } from 'rxjs';

import { AccountService } from '../../../core/account.service';
import { PhoneInfo } from '../../../core/shared/phone-info';
import { UserService } from '../../../core/user.service';
import { untilComponentDestroyed } from '../../../shared/componentDestroyed';
import { UserProfile } from '../../../user/shared/user-profile.model';

@Component({
  templateUrl: './businesses.component.html',
  styleUrls: ['./businesses.component.scss', '../../parent.scss'],
})
export class BusinessesComponent implements OnInit, OnDestroy {
  phoneInfo: any;
  pagination = new BehaviorSubject<{ first: number; rows: number }>({ first: 0, rows: 30 });
  businesses: any;
  currentFilter: string = '';
  hasNoEmail: boolean = false;
  currentBusinessType: string;
  params: any;
  profile: UserProfile;

  constructor(private accountService: AccountService, private userService: UserService, private spinner: NgxUiLoaderService) {
  }

  ngOnInit() {
  }

  getBusinesses(type, params = {}) {
    this.userService
    .getProfile()
    .pipe(untilComponentDestroyed(this)).subscribe((profile) => {
      this.profile = profile;
      this.phoneInfo = { code: profile.phoneCode, mask: profile.phoneMask };
    });
    this.params = Object.assign(params, this.params);
    this.currentBusinessType = type;
    this.spinner.startLoader('loadBusinesses');
    switch (type) {
      case 'addedByMe':
        this.accountService.getMyBusinesses(this.params).pipe(untilComponentDestroyed(this)).subscribe(businesses => {
          this.businesses = businesses;
          this.spinner.stopLoader('loadBusinesses');
        });
        break;
      case 'addedByFriends':
        this.accountService.getFriendsBusinesses(this.params).pipe(untilComponentDestroyed(this)).subscribe(businesses => {
          this.businesses = businesses;
          this.spinner.stopLoader('loadBusinesses');
        });
        break;
      case 'addedByFriendsOfFriends':
        this.accountService.getFriendsFriendsBusinesses(this.params).pipe(untilComponentDestroyed(this)).subscribe(businesses => {
          this.businesses = businesses;
          this.spinner.stopLoader('loadBusinesses');
        });
        break;
    }

  }

  onPagination(event) {
    this.pagination.next(event);
  }

  filterBusinesses(filter: string) {
    this.currentFilter = filter;
    this.params.type = filter;
    this.params.offset = 0;
    this.params.limit = 30;
    this.params.missingEmail = this.hasNoEmail;
    this.getBusinesses(this.currentBusinessType);
  }

  ngOnDestroy(): void {
  }
}
