import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { UserRole } from '../../core/shared/enums/user-role.enum';
import { UserProfile } from '../../user/shared/user-profile.model';
import { AuthService } from '../../core/auth.service';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'kz-header-profile',
  templateUrl: './header-profile.component.html',
})
export class HeaderProfileComponent implements OnInit {
  profile$: Observable<UserProfile>;
  showMenu: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private eRef: ElementRef,
  ) {
  }

  ngOnInit(): void {
    this.profile$ = this.userService.getProfile();
  }

  @HostListener('document:click', ['$event'])
  clickOut(event) {
    this.showMenu = this.eRef.nativeElement.contains(event.target) ? !this.showMenu : false;
  }

  logOut(): void {
    this.authService.logOut().subscribe(() => this.router.navigate(['/']));
  }

  isBusinessUser(profile) {
    return profile.role === UserRole.Business;
  }

}
