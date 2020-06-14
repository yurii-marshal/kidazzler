import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountService } from '../../../core/account.service';
import { UserService } from '../../../core/user.service';

@Component({
  templateUrl: './notifications-settings.component.html',
  styleUrls: ['../../user.scss'],
})
export class NotificationsSettingsComponent implements OnInit {
  allowNotifications$: Observable<boolean>;

  private allowNotifications: boolean;

  constructor(
    private toastr: ToastrService,
    private accountService: AccountService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.allowNotifications$ = this.userService
      .getProfile()
      .pipe(map(profile => (this.allowNotifications = profile.emailNotification)));
  }

  toggleNotifications(event: boolean): void {
    this.allowNotifications = event;
  }

  saveChanges(): void {
    this.accountService
      .updateAccountInfo({ emailNotification: this.allowNotifications })
      .subscribe(() => {
        this.toastr.success('Notification settings saved');
      });
  }
}
