import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '../../../core/user.service';

@Component({
  selector: 'kz-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['../../user.scss'],
})
export class SettingsMenuComponent implements OnInit {
  isEmailVerified$: Observable<boolean>;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.isEmailVerified$ = this.userService
      .getProfile()
      .pipe(map(profile => profile.emailVerified));
  }
}
