import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'kz-business-need-logout',
  templateUrl: 'business-need-logout.component.html',
  styleUrls: ['../business-user.scss']
})
export class BusinessNeedLogoutComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        if (e.url !== '/login/business') {
          localStorage.removeItem('business-claiming-token');
        }
      }
    });
  }

  logout() {
    this.authService.logOut().subscribe(() => {
      this.router.navigate(['login/business']);
    });
  }
}
