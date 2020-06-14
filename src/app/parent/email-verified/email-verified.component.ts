import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';

import { AuthService } from '../../core/auth.service';
import { UserService } from '../../core/user.service';

@Component({
  templateUrl: './email-verified.component.html',
  styleUrls: ['../parent.scss'],
})
export class EmailVerifiedComponent implements OnInit {
  isVerified: boolean;
  redirectUrl: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private auth: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    const params = this.activatedRoute.snapshot.queryParams;

    if (!params['token']) {
      return this.router.navigate(['/']);
    }

    this.auth
      .verifyEmail(params['token'])
      .pipe(tap(() => (this.isVerified = true)))
      .subscribe(
        () => {
          this.redirectUrl = this.userService.isMobile()
            ? this.userService.getMobileUrl('/download-app')
            : '/';
        },
        (response: HttpErrorResponse) => {
          if (response.status === 423) {
            this.isVerified = true;
            this.redirectUrl = '/service-unavailable';
          } else {
            this.isVerified = false;
            let message = response.error.message;

            if (response.status === 400) {
              message =
                'This link has expired.' +
                ' If you verified your account already - just login.' +
                ' If you experience any issues with your account - contact us via Contact page';
            }

            this.toastr.error(message);
            this.router.navigate(['/']);
          }
        },
      );
  }
}
