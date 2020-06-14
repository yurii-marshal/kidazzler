import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { UserProfile } from '../../../user/shared/user-profile.model';

import { UserService } from '../../../core/user.service';

@Component({
  selector: 'kz-tab-menu-newcomers',
  templateUrl: './tab-menu-newcomers.component.html',
  styleUrls: ['./tab-menu-newcomers.component.scss', '../../parent.scss'],
})
export class TabMenuNewcomersComponent implements OnInit {
  profile$: Observable<UserProfile>;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.profile$ = this.userService.getProfile();
  }
}
