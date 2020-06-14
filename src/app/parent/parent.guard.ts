import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SessionService } from '../core/session.service';
import { UserRole } from '../core/shared/enums/user-role.enum';
import { UserService } from '../core/user.service';

// todo: make universal authorization guard
@Injectable()
export class ParentGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private userService: UserService,
  ) {}

  canActivate(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this.sessionService.isAuthorized()) {
      this.router.navigate(['/login']);
      return of(false);
    }

    return this.userService.getProfileSnapshot().pipe(
      map(profile => [UserRole.Parent, UserRole.Organization].includes(profile.role)),
      catchError(() => of(false)),
    );
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
