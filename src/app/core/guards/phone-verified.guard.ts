import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class PhoneVerifiedGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.getProfile().pipe(map(profile => {
      if (profile.role !== 'Business') {
        if (profile.phoneVerified) {
          return true;
        } else {
          this.router.navigate(['/verify-phone']);
          return false;
        }
      } else {
        return true;
      }

    }));
  }

}
