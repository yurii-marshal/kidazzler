import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../core/guards/auth.guard';
import { CanUpgradeGuard } from '../core/guards/can-upgrade.guard';
import { LoggedOutGuard } from '../core/guards/logged-out.guard';

import { AboutComponent } from './about/about.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FaqComponent } from './faq/faq.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { KidazzlerConnectionComponent } from './kidazzler-connection/kidazzler-connection.component';
import { LoginBusinessComponent } from './login-business/login-business.component';
import { LoginParentComponent } from './login-parent/login-parent.component';
import { LoginWrapComponent } from './login-wrap/login-wrap.component';
import { MarketingComponent } from './marketing/marketing.component';
import { MessageSentComponent } from './message-sent/message-sent.component';
import { OurCommunityComponent } from './our-community/our-community.component';
import { PricingComponent } from './pricing/pricing.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ServiceUnavailablePageComponent } from './service-unavailable/service-unavailable.component';
import { TermsComponent } from './terms/terms.component';

const routes: Routes = [
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'message-sent', component: MessageSentComponent },
  { path: 'service-unavailable', component: ServiceUnavailablePageComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'forgot-password/:isBusiness', component: ForgotPasswordComponent },
  { path: 'about', component: AboutComponent },
  { path: 'our-community', component: OurCommunityComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'faq', component: FaqComponent },
  {
    path: 'login',
    component: LoginWrapComponent,
    canActivate: [LoggedOutGuard],
    canActivateChild: [LoggedOutGuard],
    children: [
      {
        path: '',
        component: LoginParentComponent,
      },
      {
        path: 'business',
        component: LoginBusinessComponent,
      },
    ],
  },
  { path: 'marketing', component: MarketingComponent },
  { path: 'business/:businessId/check-out/:type', component: CheckOutComponent, canActivate: [CanUpgradeGuard] },
  { path: 'business/:businessId/pricing', component: PricingComponent, canActivate: [CanUpgradeGuard] },
  { path: 'benefits', component: BenefitsComponent },
  { path: 'kidazzler-connection', component: KidazzlerConnectionComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class PublicRoutingModule {
}
