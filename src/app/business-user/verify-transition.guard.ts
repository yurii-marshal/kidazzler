import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { SessionService } from '../core/session.service';
import { UserRole } from '../core/shared/enums/user-role.enum';
import { UserService } from '../core/user.service';
import { BusinessService } from '../core/business.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class VerifyTransitionGuard implements CanActivate {
  claimingToken: string;

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private userService: UserService,
    private businessService: BusinessService,
    private toastr: ToastrService,
  ) {
  }

  async canActivate(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (location.href.includes('token')) {
      this.claimingToken = location.href.split('=')[1];
      localStorage.setItem('business-claiming-token', this.claimingToken);
    } else {
      this.router.navigate(['login']);
      return false;
    }

    try {
      const business = await this.businessService.getUnclaimedBusiness(this.claimingToken).toPromise();

      if (this.sessionService.isAuthorized()) {
        const user = await this.userService.getProfileSnapshot().toPromise();
        if (user.role === UserRole.Business) {
          this.router.navigate(['claim-business', business.id]);
        } else {
          this.router.navigate(['business-logout']);
          return false;
        }
      }
    } catch (error) {
      if (error.status === 400) {
        localStorage.removeItem('business-claiming-token');
        this.toastr.error(error.error.message);
        this.router.navigate(['/']);
        return false;
      }
    }

    return true;
  }
}
