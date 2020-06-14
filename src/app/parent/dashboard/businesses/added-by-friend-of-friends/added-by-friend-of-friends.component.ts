import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { AccountService } from '../../../../core/account.service';
import { UserService } from '../../../../core/user.service';
import { untilComponentDestroyed } from '../../../../shared/componentDestroyed';
import { UserProfile } from '../../../../user/shared/user-profile.model';
import { BusinessesComponent } from '../businesses.component';

@Component({
  selector: 'kz-added-by-friend-of-friends',
  templateUrl: './added-by-friend-of-friends.component.html',
  styleUrls: ['./added-by-friend-of-friends.component.scss', '../businesses.component.scss', '../../../parent.scss'],
})
export class AddedByFriendOfFriendsComponent extends BusinessesComponent implements OnInit {
  params: any = {};

  constructor(accountService: AccountService, userService: UserService, spinner: NgxUiLoaderService) {
    super(accountService, userService, spinner);
  }

  ngOnInit() {
    this.currentBusinessType = 'addedByFriendsOfFriends';
    this.pagination
      .pipe(
        untilComponentDestroyed(this),
      ).subscribe((event) => {
      this.getBusinesses(this.currentBusinessType, Object.assign(this.params, {
        offset: event.first,
        limit: event.rows,
      }));
    });
  }
}

