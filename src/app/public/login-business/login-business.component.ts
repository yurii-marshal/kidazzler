import { Component } from '@angular/core';
import { EmailAuth } from '../../core/shared/email-auth.model';
import { Observable } from 'rxjs';
import { LoginParentComponent } from '../login-parent/login-parent.component';

@Component({
  selector: 'kz-login-business',
  templateUrl: './login-business.component.html',
  styleUrls: ['../public.scss'],
})
export class LoginBusinessComponent extends LoginParentComponent {

  login(credentials: EmailAuth): Observable<boolean> {
    return this.authService.loginAsBusiness(credentials);
  }
}
