import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth.service';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';
import { UserRole } from '../shared/enums/user-role.enum';

/**
 * Prevents access to a route for logged in users.
 */
@Injectable()
export class LoggedOutGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private userService: UserService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.sessionService.isAuthorized()) {
      return this.userService.getProfileSnapshot().pipe(
        map(profile => {
          if (profile.role === UserRole.Business) {
            this.router.navigate(['/businesses']);
          } else {
            this.router.navigate(['/dashboard']);
          }

          return false;
        }),
      );
    }

    return of(true);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
