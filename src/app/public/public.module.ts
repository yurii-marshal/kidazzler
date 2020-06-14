import { NgModule } from '@angular/core';
import { CreditCardDirectivesModule } from 'angular-cc-library';

import { SharedModule } from '../shared/shared.module';

import { AboutComponent } from './about/about.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FaqComponent } from './faq/faq.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginBusinessComponent } from './login-business/login-business.component';
import { LoginParentComponent } from './login-parent/login-parent.component';
import { LoginWrapComponent } from './login-wrap/login-wrap.component';
import { MarketingComponent } from './marketing/marketing.component';
import { MessageSentComponent } from './message-sent/message-sent.component';
import { OurCommunityComponent } from './our-community/our-community.component';
import { PricingComponent } from './pricing/pricing.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { PublicRoutingModule } from './public-routing.module';
import { PublicService } from './public.service';
import { ServiceUnavailablePageComponent } from './service-unavailable/service-unavailable.component';
import { TermsComponent } from './terms/terms.component';
import { KidazzlerConnectionComponent } from './kidazzler-connection/kidazzler-connection.component';

@NgModule({
  imports: [SharedModule, PublicRoutingModule, CreditCardDirectivesModule],
  declarations: [
    ContactUsComponent,
    MessageSentComponent,
    AboutComponent,
    PrivacyComponent,
    TermsComponent,
    FaqComponent,
    ServiceUnavailablePageComponent,
    LoginWrapComponent,
    LoginParentComponent,
    LoginBusinessComponent,
    ForgotPasswordComponent,
    CheckOutComponent,
    PricingComponent,
    BenefitsComponent,
    OurCommunityComponent,
    MarketingComponent,
    KidazzlerConnectionComponent,
  ],
  exports: [ForgotPasswordComponent],
  providers: [PublicService],
})
export class PublicModule {}
