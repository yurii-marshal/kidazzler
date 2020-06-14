import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserRole } from '../../core/shared/enums/user-role.enum';
import { UserService } from '../../core/user.service';

@Component({
  templateUrl: './email-changed.component.html',
  styleUrls: ['../user.scss'],
})
export class EmailChangedComponent implements OnInit {
  redirectUrl: string;

  get isMobile(): boolean {
    return this.userService.isMobile();
  }

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    const role = this.route.snapshot.queryParams['role'];
    this.redirectUrl = this.isMobile
      ? this.userService.getMobileUrl('/download-app')
      : role === UserRole.Business
      ? '/login/business'
      : '/login';
  }
}
