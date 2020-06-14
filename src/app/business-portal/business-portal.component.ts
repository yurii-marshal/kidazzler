import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../core/user.service';
@Component({
  selector: 'kz-business-portal',
  template: `
    <kz-header
      *ngIf="isDesktop"
      type="withMenu"
    ></kz-header>

    <router-outlet></router-outlet>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class BusinessPortalComponent implements OnInit, OnDestroy {
  isDesktop: boolean;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.isDesktop = this.userService.isMobile() === false;
  }

  ngOnDestroy(): void {
  }

}
