import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AccountService } from '../account.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ValidResetPasswordTokenGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    const verificationToken = next.queryParams.token;

    if (!verificationToken) {
      this.router.navigate(['/']);
      return false;
    }

    return this.accountService.verifyResetPasswordToken(verificationToken).pipe(
      map(() => true),
      catchError((response: HttpErrorResponse) => {
        if (response.status === 400) {
          this.toastr.error('Reset password link has expired');
          this.router.navigate(['/']);
        }

        return of(false);
      }),
    );
  }
}
