import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { SignupService } from '../core/signup.service';

@Injectable()
export class ValidInvitationCodeGuard implements CanActivate {
  constructor(
    private signupService: SignupService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  async canActivate(
    snapshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    const code = snapshot.params.code;
    const storedCode = this.signupService.getInvitationCode();

    if (code && code !== storedCode) {
      try {
        return await this.signupService.verifyInvitationCode(code);
      } catch (response) {
        this.toastr.error(response.error.message);
        this.router.navigate(['/']);

        return false;
      }
    } else if (storedCode) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
