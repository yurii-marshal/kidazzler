import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { environment } from '../../../environments/environment';

export enum GoogleAnalyticsEvent {
  Login = 'login',
  BusinessPhoneNumberInUse = 'business_phone_number_in_use',
}

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  private initialized: boolean;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initialize();
  }

  track(event: GoogleAnalyticsEvent, data?: { [param: string]: any }) {
    if (!this.initialized) return;

    window['gtag']('event', event, data);
  }

  private initialize() {
    if (!environment.gaId) return;

    window['dataLayer'] = window['dataLayer'] || [];
    window['gtag'] = function() {
      window['dataLayer'].push(arguments);
    };

    const scriptId = 'g-analytics';
    if (!this.document.getElementById(scriptId)) {
      const analyticsScript = this.document.createElement('script');
      analyticsScript.id = scriptId;
      analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${environment.gaId}`;
      analyticsScript.async = true;
      this.document.body.insertBefore(analyticsScript, this.document.body.firstChild);
    }

    window['gtag']('js', new Date());
    window['gtag']('config', environment.gaId);

    this.initialized = true;
  }
}
