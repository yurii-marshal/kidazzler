import { NgModule } from '@angular/core';

import { ToastrModule } from 'ngx-toastr';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MapSearchErrorToastComponent } from '../shared/map-search-error-toast/map-search-error-toast.component';

import { SignupService } from './signup.service';
import { AccountService } from './account.service';
import { EmailChangeVerifiedGuard } from './guards/email-change-verified.guard';
import { EmailVerifiedGuard } from './guards/email-verified.guard';
import { ValidResetPasswordTokenGuard } from './guards/valid-reset-password-token.guard';
import { OnlyWebUsersGuard } from './guards/only-web-users.guard';
import { AuthService } from './auth.service';
import { UserNotificationService } from './user-notifications.service';
import { BadgesService } from './badges.service';
import { SessionService } from './session.service';
import { LoggedOutGuard } from './guards/logged-out.guard';
import { AuthGuard } from './guards/auth.guard';
import { BusinessService } from './business.service';
import { CanAddBusinessGuard } from './guards/can-add-business.guard';
import { ApiService } from './api.service';
import { ERROR_MESSAGES, MESSAGES } from './shared/error-messages';
import { UserService } from './user.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  imports: [ToastrModule.forRoot()],
  providers: [
    ApiService,
    AccountService,
    SignupService,
    EmailChangeVerifiedGuard,
    EmailVerifiedGuard,
    ValidResetPasswordTokenGuard,
    AuthGuard,
    LoggedOutGuard,
    OnlyWebUsersGuard,
    AuthService,
    SessionService,
    BadgesService,
    SignupService,
    BusinessService,
    UserNotificationService,
    CanAddBusinessGuard,
    UserService,
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: ERROR_MESSAGES, useValue: MESSAGES },
  ],
  entryComponents: [MapSearchErrorToastComponent],
})
export class CoreModule {
}
