import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserProfile } from '../../user/shared/user-profile.model';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class CheckLocationGuard {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.userService.getProfile().pipe(
      map((profile: UserProfile) => {
        if (profile.city && profile.country) {
          return true;
        } else {
          this.router.navigate(['/set-location']);
          return false;
        }
      }),
    );
  }
}
