import { Component, Input } from '@angular/core';

import { FacebookService } from '../../core/facebook.service';

@Component({
  selector: 'kz-facebook-auth',
  templateUrl: './facebook-auth.component.html',
})
export class FacebookAuthComponent {
  @Input() type: 'login' | 'signup' = 'login';

  constructor(private facebookService: FacebookService) {}

  authenticate() {
    if (this.type === 'login') {
      this.facebookService.logIn();
    } else {
      this.facebookService.prepareSignup();
    }
  }
}
