import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

class AuthTokenService {
  setToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  getToken(): string {
    return localStorage.getItem('accessToken');
  }

  removeToken() {
    localStorage.removeItem('accessToken');
  }
}

class TokenChangedError {}

export enum SessionEvent {
  Started = 'started',
  Ended = 'ended',
}

@Injectable()
export class SessionService {
  readonly EVENTS: Observable<SessionEvent>;

  private eventsSource: Subject<SessionEvent>;
  private sessionToken: string;

  private authTokenService = new AuthTokenService();

  constructor(private router: Router) {
    this.eventsSource = new Subject<SessionEvent>();

    this.EVENTS = this.eventsSource.asObservable();
  }

  isAuthorized(): boolean {
    return !!this.authTokenService.getToken();
  }

  getAuthToken(): string {
    const storedToken = this.authTokenService.getToken();

    if (!this.sessionToken) this.sessionToken = storedToken;

    if (this.sessionToken !== storedToken) {
      this.startSession(storedToken);

      this.router.navigate(['/']);

      throw new TokenChangedError();
    }

    return this.sessionToken;
  }

  startSession(authToken: string) {
    this.authTokenService.setToken(authToken);
    this.sessionToken = authToken;

    this.eventsSource.next(SessionEvent.Started);
  }

  endSession() {
    this.authTokenService.removeToken();
    this.sessionToken = null;

    this.eventsSource.next(SessionEvent.Ended);
  }
}
