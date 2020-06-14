import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BusinessService } from '../business.service';

@Injectable({
  providedIn: 'root',
})
export class CanUpgradeGuard implements CanActivate {
  constructor(private router: Router, private businessService: BusinessService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.businessService.getBusinessById(next.params['businessId'] || next.params['id']).pipe(
      map(business => {
        return !business.memberAt;
      }),
    );
  }
}
