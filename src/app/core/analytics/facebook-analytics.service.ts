import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { environment } from '../../../environments/environment';

export enum FacebookAnalyticsEvent {
  PageView = 'PageView',
}

@Injectable({
  providedIn: 'root',
})
export class FacebookAnalyticsService {
  private initialized: boolean;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initialize();
  }

  track(event: FacebookAnalyticsEvent) {
    if (!this.initialized) return;

    window['fbq']('track', event);
  }

  private initialize() {
    if (!environment.facebookAnalyticsId) return;

    if (!window['fbq']) {
      let fbq: any;

      fbq = window['fbq'] = function() {
        fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
      };
      if (!window['_fbq']) window['_fbq'] = fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
    }

    const scriptId = 'fb-analytics';
    if (!this.document.getElementById(scriptId)) {
      const analyticsScript = this.document.createElement('script');
      analyticsScript.id = scriptId;
      analyticsScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
      analyticsScript.async = true;
      this.document.body.insertBefore(analyticsScript, this.document.body.firstChild);
    }

    window['fbq']('init', environment.facebookAnalyticsId);

    this.initialized = true;
  }
}
