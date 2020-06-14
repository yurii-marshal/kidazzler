import { Component, OnInit } from '@angular/core';

import { switchMap } from 'rxjs/operators';

import { AccountService } from '../../../core/account.service';
import { UserBadgesInfo } from '../../../core/shared/user-badges-info';
import { UserService } from '../../../core/user.service';

@Component({
  selector: 'kz-user-badges',
  templateUrl: './user-badges.component.html',
  styleUrls: ['../../parent.scss'],
})
export class UserBadgesComponent implements OnInit {
  info: UserBadgesInfo;

  constructor(private accountService: AccountService, private userService: UserService) {}

  ngOnInit() {
    this.userService
      .getProfile()
      .pipe(switchMap(() => this.accountService.getBadgesInfo()))
      .subscribe(info => (this.info = info));
  }
}
