import { Component, HostBinding, Input } from '@angular/core';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'kz-mobile-apps',
  templateUrl: './mobile-apps.component.html',
  styleUrls: ['./mobile-apps.component.scss'],
})
export class MobileAppsComponent {
  androidAppUrl = environment.androidAppPageUrl;
  iosAppUrl = environment.iosAppPageUrl;

  @Input() isWhiteFill = true;

  @HostBinding('attr.class') @Input() direction = 'horizontal';

  constructor() {
  }
}
