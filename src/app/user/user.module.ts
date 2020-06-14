import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { EmailChangedComponent } from './email-changed/email-changed.component';
import { MobileDashboardComponent } from './mobile-dashboard/mobile-dashboard.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PhoneVerificationSubmitComponent } from './phone-verification-submit/phone-verification-submit.component';
import { PhoneVerificationComponent } from './phone-verification/phone-verification.component';
import { EmailSettingsComponent } from './settings/email-settings/email-settings.component';
import { NotificationsSettingsComponent } from './settings/notifications-settings/notifications-settings.component';
import { PasswordSettingsComponent } from './settings/password-settings/password-settings.component';
import { ProfileSettingsComponent } from './settings/profile-settings/profile-settings.component';
import { SettingsMenuComponent } from './settings/settings-menu/settings-menu.component';
import { SettingsComponent } from './settings/settings.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [SharedModule, UserRoutingModule],
  declarations: [
    EmailChangedComponent,
    SettingsComponent,
    SettingsMenuComponent,
    ProfileSettingsComponent,
    PasswordSettingsComponent,
    NotificationsSettingsComponent,
    EmailSettingsComponent,
    PasswordResetComponent,
    MobileDashboardComponent,
    PhoneVerificationSubmitComponent,
    PhoneVerificationComponent
  ],
})
export class UserModule {
}
