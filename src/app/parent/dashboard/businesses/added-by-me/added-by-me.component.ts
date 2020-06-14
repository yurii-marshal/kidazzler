import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AccountService } from '../../../../core/account.service';
import { UserService } from '../../../../core/user.service';
import { untilComponentDestroyed } from '../../../../shared/componentDestroyed';
import { BusinessesComponent } from '../businesses.component';
import { UserProfile } from '../../../../user/shared/user-profile.model';

@Component({
  selector: 'kz-added-by-me',
  templateUrl: './added-by-me.component.html',
  styleUrls: ['./added-by-me.component.scss', '../businesses.component.scss', '../../../parent.scss'],
})
export class AddedByMeComponent extends BusinessesComponent implements OnInit {
  params: any = {};
  profile: UserProfile;

  constructor(accountService: AccountService, userService: UserService, spinner: NgxUiLoaderService) {
    super(accountService, userService, spinner);
  }

  ngOnInit() {
    this.currentBusinessType = 'addedByMe';
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
