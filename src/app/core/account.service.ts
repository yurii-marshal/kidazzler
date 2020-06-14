import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { PaginatedDataParams } from './shared/paginated-data-params';
import { PaginatedData } from './shared/paginated-data';
import { RewardInfo } from './shared/reward-info';
import { UserBadgesInfo } from './shared/user-badges-info';
import { UserService } from './user.service';

@Injectable()
export class AccountService {
  private rewardInfo$ = new Subject<RewardInfo>();

  constructor(
    private api: ApiService,
    private http: HttpClient,
    private userService: UserService,
  ) {
  }

  updateAccountInfo(data): Observable<null> {
    data = Object.assign({}, data);

    if (data.avatar === environment.defaultAvatarUrl) {
      delete data.avatar;
    }

    return this.api.put<null>('accounts/me', data, { displayError: true }).pipe(
      tap(() => {
        delete data.email;

        if (Object.keys(data).length) {
          this.userService.updateProfileInfo(data);
        }
      }),
    );
  }

  verifyPhoneNumber(code: string): Observable<any> {
    return this.api.post('accounts/me/verify-phone', { code: code });
  }

  confirmEmailChange(token: string): Observable<null> {
    return this.api.post('accounts/confirm-email-change', { token });
  }

  resetPassword(email: string, isBusiness: boolean): Observable<null> {
    return this.api.post('accounts/reset-password', { email, isBusiness });
  }

  getMyBusinesses(params?): Observable<any> {
    return this.api.get('accounts/me/businesses', { params: params });
  }

  getFriendsBusinesses(params?): Observable<any> {
    return this.api.get('accounts/me/friends-businesses', { params: params });
  }

  getFriendsFriendsBusinesses(params?): Observable<any> {
    return this.api.get('accounts/me/friends-friends-businesses', { params: params });
  }

  verifyResetPasswordToken(token): Observable<null> {
    return this.api.post('accounts/verify-reset-password-token', { token });
  }

  restorePassword(data: {
    token: string;
    password: string;
    confirmationPassword: string;
  }): Observable<null> {
    return this.api.post('accounts/restore-password', data);
  }

  getPointsInfo(): Observable<any> {
    return this.api.get('accounts/me/points');
  }

  sendVerifyPhoneCode(): Observable<any> {
    return this.api.post('accounts/me/start-phone-verification', {});
  }

  changePassword(data: { oldPassword: string; newPassword: string }): Observable<null> {
    return this.api.put('accounts/change-password', data, { displayError: true });
  }

  getFriends(params?: PaginatedDataParams): Observable<PaginatedData<any>> {
    // todo: add type for referral
    return this.api
      .get<PaginatedData<any>>('accounts/me/referrals', {
        params: ApiService.normalizePaginatedDataParams(params),
      })
      .pipe(
        map(data => {
          data.items.forEach(friend => {
            if (!friend.avatar) {
              friend.avatar = environment.defaultAvatarUrl;
            }
          });

          this.userService.updateProfileInfo({ friendsCount: data.count });

          return data;
        }),
      );
  }

  async uploadAvatar(avatar: File): Promise<string> {
    const { fileUrl, uploadUrl } = await this.api
      .get<{ fileUrl: string; uploadUrl: string }>('storage/upload-url', {
        params: { type: 'user_avatar', contentType: avatar.type },
      })
      .toPromise();

    await this.http
      .put(uploadUrl, avatar, {
        headers: {
          'Content-Type': avatar.type,
        },
      })
      .toPromise();

    return fileUrl;
  }

  getBadgesInfo(): Observable<UserBadgesInfo> {
    return this.api.get('accounts/me/badges');
  }

  async getReferralSignupUrl(): Promise<string> {
    const profile = await this.userService.getProfileSnapshot().toPromise();

    return `${environment.url}/invite/${profile.invitationCode}`;
  }

  async invite(invitees: string[]): Promise<null> {
    return this.api.post<null>('accounts/invite', invitees).toPromise();
  }

  getRewardInfo(): Observable<RewardInfo> {
    this.api
      .get<RewardInfo>('accounts/me/reward-info')
      .subscribe(info => this.rewardInfo$.next(info));

    return this.rewardInfo$.asObservable();
  }
}
