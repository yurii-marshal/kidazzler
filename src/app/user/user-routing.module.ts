import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../core/guards/auth.guard';
import { EmailChangeVerifiedGuard } from '../core/guards/email-change-verified.guard';
import { EmailVerifiedGuard } from '../core/guards/email-verified.guard';
import { OnlyWebUsersGuard } from '../core/guards/only-web-users.guard';
import { PhoneVerifiedGuard } from '../core/guards/phone-verified.guard';
import { ValidResetPasswordTokenGuard } from '../core/guards/valid-reset-password-token.guard';

import { EmailChangedComponent } from './email-changed/email-changed.component';
import { MobileDashboardComponent } from './mobile-dashboard/mobile-dashboard.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PhoneVerificationSubmitComponent } from './phone-verification-submit/phone-verification-submit.component';
import { PhoneVerificationComponent } from './phone-verification/phone-verification.component';
import { EmailSettingsComponent } from './settings/email-settings/email-settings.component';
import { NotificationsSettingsComponent } from './settings/notifications-settings/notifications-settings.component';
import { PasswordSettingsComponent } from './settings/password-settings/password-settings.component';
import { ProfileSettingsComponent } from './settings/profile-settings/profile-settings.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: 'email-changed',
    component: EmailChangedComponent,
    canActivate: [EmailChangeVerifiedGuard],
  },
  {
    path: 'reset-password',
    component: PasswordResetComponent,
    canActivate: [ValidResetPasswordTokenGuard],
  },
  {
    path: 'verify-phone',
    children: [
      { path: '', component: PhoneVerificationComponent },
      { path: 'submit', component: PhoneVerificationSubmitComponent },
    ],
  },
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'mobile', component: MobileDashboardComponent },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [OnlyWebUsersGuard],
        children: [
          {
            path: 'profile', component: ProfileSettingsComponent,
            canActivate: [PhoneVerifiedGuard],
          },
          {
            path: 'email',
            component: EmailSettingsComponent,
            canActivate: [EmailVerifiedGuard],
          },
          {
            path: 'password',
            component: PasswordSettingsComponent,
            canActivate: [EmailVerifiedGuard],
          },
          { path: 'notifications', component: NotificationsSettingsComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class UserRoutingModule {
}
