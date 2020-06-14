import { Component, Input } from '@angular/core';

import { environment } from '../../../environments/environment';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'kz-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  blogUrl = environment.blogUrl;
  @Input() isFullVersion = true;

  constructor(private sessionService: SessionService) {
  }

  isAuthorized(): boolean {
    return this.sessionService.isAuthorized();
  }
}
