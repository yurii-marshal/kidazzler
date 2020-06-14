import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AccountService } from '../../../../core/account.service';
import { UserService } from '../../../../core/user.service';
import { untilComponentDestroyed } from '../../../../shared/componentDestroyed';
import { BusinessesComponent } from '../businesses.component';
import { UserProfile } from '../../../../user/shared/user-profile.model';

@Component({
  selector: 'kz-added-by-friends',
  templateUrl: './added-by-friends.component.html',
  styleUrls: ['./added-by-friends.component.scss', '../businesses.component.scss', '../../../parent.scss'],
})
export class AddedByFriendsComponent extends BusinessesComponent implements OnInit {
  params: any = {};

  constructor(accountService: AccountService, userService: UserService, spinner: NgxUiLoaderService) {
    super(accountService, userService, spinner);
  }

  ngOnInit() {
    this.currentBusinessType = 'addedByFriends';

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
