import { NgModule } from '@angular/core';
import { CheckboxModule } from 'primeng/primeng';

import { SharedModule } from '../shared/shared.module';
import { ParentRoutingModule } from './parent-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReferralsComponent } from './dashboard/referrals/referrals.component';
import { BusinessesComponent } from './dashboard/businesses/businesses.component';
import { AddBusinessComponent } from './add-business/add-business.component';
import { BusinessAddedComponent } from './popups/business-added/business-added.component';
import { PageAdditionalInfoComponent } from './page-additional-info/page-additional-info.component';
import { UserBadgesComponent } from './dashboard/user-badges/user-badges.component';
import { InviteFriendsComponent } from './popups/invite-friends/invite-friends.component';
import { RewardCalculationComponent } from './popups/reward-calculation/reward-calculation.component';
import { UnlockRewardsComponent } from './popups/unlock-rewards/unlock-rewards.component';
import { BadgesComponent } from './popups/badges/badges.component';
import { TabMenuNewcomersComponent } from './dashboard/tab-menu-newcomers/tab-menu-newcomers.component';
import { MaxLevelProducerComponent } from './popups/max-level-producer/max-level-producer.component';
import { SuccessfulSignupComponent } from './successful-signup/successful-signup.component';
import { RequestInvitationComponent } from './popups/request-invitation/request-invitation.component';
import { EmailVerifiedComponent } from './email-verified/email-verified.component';
import { IndexPageComponent } from './index-page/index-page.component';
import { DownloadAppComponent } from './download-app/download-app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DashboardRewardPipe } from './dashboard/_pipes/dashboard-reward.pipe';
import { HomeComponent } from './home/home.component';
import { PointsComponent } from './dashboard/points/points.component';
import { AddedByMeComponent } from './dashboard/businesses/added-by-me/added-by-me.component';
import { AddedByFriendsComponent } from './dashboard/businesses/added-by-friends/added-by-friends.component';
import { AddedByFriendOfFriendsComponent } from './dashboard/businesses/added-by-friend-of-friends/added-by-friend-of-friends.component';

@NgModule({
  imports: [SharedModule, ParentRoutingModule, CheckboxModule],
  declarations: [
    DashboardComponent,
    ReferralsComponent,
    BusinessesComponent,
    AddBusinessComponent,
    BusinessAddedComponent,
    PageAdditionalInfoComponent,
    UserBadgesComponent,
    InviteFriendsComponent,
    RewardCalculationComponent,
    UnlockRewardsComponent,
    BadgesComponent,
    TabMenuNewcomersComponent,
    MaxLevelProducerComponent,
    RequestInvitationComponent,
    SuccessfulSignupComponent,
    EmailVerifiedComponent,
    IndexPageComponent,
    DownloadAppComponent,
    SignUpComponent,
    DashboardRewardPipe,
    HomeComponent,
    PointsComponent,
    AddedByMeComponent,
    AddedByFriendsComponent,
    AddedByFriendOfFriendsComponent,
  ],
})
export class ParentModule {}
