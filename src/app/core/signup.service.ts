import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ApiService } from './api.service';
import { Country } from './shared/country.model';
import { SessionService } from './session.service';

@Injectable()
export class SignupService {
  private countries: Country[];

  constructor(private api: ApiService, private sessionService: SessionService) {}

  signup(data): Observable<null> {
    data.invitationCode = this.getInvitationCode();

    return this.api.post<null>('signup', data).pipe(tap(() => this.clearInvitationCode()));
  }

  businessSignup(data): Observable<null> {
    return this.api.post('business-signup', data).pipe(
      map(({ token }) => {
        this.sessionService.startSession(token);
        return null;
      }),
    );
  }

  requestInvitation(email: string): Promise<null> {
    return this.api.post<null>('signup/request-invitation', { email }).toPromise();
  }

  verifyInvitationCode(invitationCode: string): Promise<boolean> {
    return this.api
      .post('verify-invitation-code', { invitationCode })
      .pipe(
        map(res => {
          this.setInvitationCode(res['invitationCode']);

          return true;
        }),
      )
      .toPromise();
  }

  searchCountries(query?: string): Observable<Country[]> {
    let result: Observable<Country[]>;

    if (this.countries) {
      result = of(this.countries);
    } else {
      result = this.api
        .get<Country[]>('countries')
        .pipe(tap(countries => (this.countries = countries)));
    }

    if (query) {
      result = result.pipe(
        map(countries =>
          countries.filter(country => {
            return country.description.toLowerCase().indexOf(query.toLowerCase()) !== -1;
          }),
        ),
      );
    }

    return result;
  }

  getInvitationCode(): string {
    return localStorage.getItem('invitation-code');
  }

  clearInvitationCode() {
    localStorage.removeItem('invitation-code');
  }

  private setInvitationCode(code: string): void {
    localStorage.setItem('invitation-code', code);
  }
}
