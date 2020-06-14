import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '../user.service';

@Injectable()
export class CanAddBusinessGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.reloadProfile().pipe(
      map(profile => {
        if (profile.maxLevelProducer) {
          this.router.navigate([{ outlets: { popup: ['rockstar'] } }]);

          return false;
        }

        return true;
      }),
    );
  }
}
