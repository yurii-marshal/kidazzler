import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ApiService } from './api.service';
import { SessionService } from './session.service';
import { environment } from '../../environments/environment';
import { SignupService } from './signup.service';
import { GoogleAnalyticsEvent, GoogleAnalyticsService } from './analytics/google-analytics.service';
import { UserService } from './user.service';

declare const FB: any;

@Injectable({
  providedIn: 'root',
})
export class FacebookService {
  constructor(
    private api: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private sessionService: SessionService,
    private signupService: SignupService,
    private analyticsService: GoogleAnalyticsService,
    private userService: UserService,
  ) {
    if (!environment.facebookAppId) {
      throw new Error('Invalid Facebook app ID');
    }

    FB.init({
      appId: environment.facebookAppId,
      cookie: false,
      xfbml: false,
      version: 'v2.9',
    });
  }

  async logIn(accessToken?: string): Promise<any> {
    if (!accessToken) {
      accessToken = await this.getAccessToken();
    }

    if (!accessToken) {
      return;
    }

    try {
      const data = await this.api.post('login/facebook', { accessToken }).toPromise();
      this.sessionService.startSession(data['token']);

      const profile = await this.userService.getProfileSnapshot().toPromise();

      this.analyticsService.track(GoogleAnalyticsEvent.Login, {
        method: 'Facebook',
        event_label: `Session started for user id: ${profile.id}`,
      });

      this.redirectOnSuccess();
    } catch (error) {
      if (error.status === 403) {
        this.router.navigate(['/']);
      }
      this.toastr.error(error.error.message);

    }
  }

  async prepareSignup(): Promise<any> {
    const accessToken = await this.getAccessToken();

    if (!accessToken) {
      return;
    }

    localStorage.setItem('fbAccessToken', accessToken);

    try {
      const missingFields = await this.api
        .post<string[]>('signup/facebook/check-profile', { accessToken })
        .toPromise();

      if (missingFields.length) {
        localStorage.setItem('fbMissingFields', JSON.stringify(missingFields));
      }
    } catch (response) {
      if (response.status === 409) {
        return this.logIn(accessToken);
      }
    }

    this.router.navigate(['/additional-info']);
  }

  getStoredMissingFields(): string[] {
    if (localStorage.getItem('fbMissingFields')) {
      return JSON.parse(localStorage.getItem('fbMissingFields'));
    }

    return [];
  }

  async signUp(data): Promise<any> {
    data.accessToken = localStorage.getItem('fbAccessToken');
    data.invitationCode = this.signupService.getInvitationCode();

    const result = await this.api
      .post<any>('signup/facebook', data, { displayError: true })
      .toPromise();
    const token = result ? result.token : null;

    this.signupService.clearInvitationCode();

    localStorage.removeItem('fbAccessToken');
    localStorage.removeItem('fbMissingFields');

    if (token) {
      //email retrieved from facebook profile and session is created
      this.sessionService.startSession(token);

      this.redirectOnSuccess();
    }
    if (!token && data.email) {
      //email was not found in facebook profile, redirect to screen with email confirmation message
      this.router.navigate(['/successful-signup']);
    }
  }

  async postToWall(url: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      FB.ui(
        {
          method: 'feed',
          link: url,
        },
        (response: any) => resolve(response),
      );
    });
  }

  private async getAccessToken(): Promise<string> {
    const response = await new Promise<any>((resolve, reject) =>
      FB.login(res => resolve(res), {
        scope: 'email',
        return_scopes: true,
      }),
    );

    if (!response.authResponse) {
      return null;
    }

    return response.authResponse.accessToken;
  }

  private redirectOnSuccess() {
    if (this.userService.isMobile()) {
      window.location.assign(this.userService.getMobileUrl('/download-app'));
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
