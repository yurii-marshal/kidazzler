import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { ApiService } from './api.service';
import { SessionService } from './session.service';
import { EmailAuth } from './shared/email-auth.model';
import { GoogleAnalyticsEvent, GoogleAnalyticsService } from './analytics/google-analytics.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private api: ApiService,
    private sessionService: SessionService,
    private analyticsService: GoogleAnalyticsService,
    private userService: UserService,
  ) {}

  loginAsParent(credentials: EmailAuth): Observable<null> {
    return this.login('login', credentials);
  }

  loginAsBusiness(credentials: EmailAuth): Observable<null> {
    return this.login('login/business', credentials);
  }

  sendVerificationMessage(email: string): Observable<null> {
    return this.api.post('accounts/send-verification-email', { email }, { displayError: true });
  }

  verifyEmail(token: string): Observable<null> {
    return this.api.post('accounts/verify-email', { token }, { throwError: true }).pipe(
      map((data: any) => {
        this.sessionService.startSession(data.token);

        this.userService.updateProfileInfo({ emailVerified: true });

        return null;
      }),
    );
  }

  logOut(): Observable<null> {
    // localStorage.removeItem('business-email');
    // localStorage.removeItem('business-country');
    // localStorage.removeItem('business-id');
    return this.api.delete<null>('logout').pipe(tap(() => this.sessionService.endSession()));
  }

  private login(url: string, credentials: EmailAuth): Observable<null> {
    return this.api.post(url, credentials).pipe(
      switchMap((response: any) => {
        this.sessionService.startSession(response.token);

        return this.userService.getProfileSnapshot();
      }),
      map(profile => {
        this.analyticsService.track(GoogleAnalyticsEvent.Login, {
          method: 'Email',
          event_label: `Session started for user id: ${profile.id}`,
        });

        return null;
      }),
    );
  }
}
