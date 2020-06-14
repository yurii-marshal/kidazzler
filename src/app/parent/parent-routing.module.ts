import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanAddBusinessGuard } from '../core/guards/can-add-business.guard';
import { LoggedOutGuard } from '../core/guards/logged-out.guard';
import { OnlyWebUsersGuard } from '../core/guards/only-web-users.guard';

import { AddBusinessComponent } from './add-business/add-business.component';
import { AddedByFriendOfFriendsComponent } from './dashboard/businesses/added-by-friend-of-friends/added-by-friend-of-friends.component';
import { AddedByFriendsComponent } from './dashboard/businesses/added-by-friends/added-by-friends.component';
import { AddedByMeComponent } from './dashboard/businesses/added-by-me/added-by-me.component';
import { BusinessesComponent } from './dashboard/businesses/businesses.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PointsComponent } from './dashboard/points/points.component';
import { ReferralsComponent } from './dashboard/referrals/referrals.component';
import { DownloadAppComponent } from './download-app/download-app.component';
import { EmailVerifiedComponent } from './email-verified/email-verified.component';
import { HomeComponent } from './home/home.component';
import { IndexPageComponent } from './index-page/index-page.component';
import { PageAdditionalInfoComponent } from './page-additional-info/page-additional-info.component';
import { ParentGuard } from './parent.guard';
import { BadgesComponent } from './popups/badges/badges.component';
import { BusinessAddedComponent } from './popups/business-added/business-added.component';
import { InviteFriendsComponent } from './popups/invite-friends/invite-friends.component';
import { MaxLevelProducerComponent } from './popups/max-level-producer/max-level-producer.component';
import { RequestInvitationComponent } from './popups/request-invitation/request-invitation.component';
import { RewardCalculationComponent } from './popups/reward-calculation/reward-calculation.component';
import { UnlockRewardsComponent } from './popups/unlock-rewards/unlock-rewards.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SuccessfulSignupComponent } from './successful-signup/successful-signup.component';
import { ValidInvitationCodeGuard } from './valid-invitation-code.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [LoggedOutGuard],
    canActivateChild: [LoggedOutGuard],
    children: [
      { path: '', pathMatch: 'full', component: IndexPageComponent },
      { path: 'invite/:code', redirectTo: 'sign-up/:code' },
      {
        path: 'sign-up/:code',
        component: SignUpComponent,
        canActivate: [ValidInvitationCodeGuard],
      },
      { path: 'successful-signup', component: SuccessfulSignupComponent },
      { path: 'additional-info', component: PageAdditionalInfoComponent },
    ],
  },
  { path: 'home', component: HomeComponent },
  { path: 'verify-account', component: EmailVerifiedComponent },
  { path: 'download-app', component: DownloadAppComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [ParentGuard, OnlyWebUsersGuard],
    canActivateChild: [ParentGuard, OnlyWebUsersGuard],
    children: [
      { path: '', component: ReferralsComponent },
      {
        path: 'businesses', component: BusinessesComponent, children: [
          { path: 'added-by-me', component: AddedByMeComponent },
          { path: 'added-by-friends', component: AddedByFriendsComponent },
          { path: 'added-by-friends-of-friends', component: AddedByFriendOfFriendsComponent },
        ],
      },
      { path: 'points', component: PointsComponent },
    ],
  },
  {
    path: 'add-business',
    component: AddBusinessComponent,
    canActivate: [ParentGuard, CanAddBusinessGuard, OnlyWebUsersGuard],
  },
  {
    path: 'edit-business/:id',
    component: AddBusinessComponent,
    canActivate: [ParentGuard, OnlyWebUsersGuard],
  },

  // secondary routes
  {
    path: 'invite',
    component: InviteFriendsComponent,
    outlet: 'popup',
    canActivate: [ParentGuard, OnlyWebUsersGuard],
  },
  {
    path: 'reward/:type',
    component: RewardCalculationComponent,
    outlet: 'popup',
    canActivate: [ParentGuard, OnlyWebUsersGuard],
  },
  {
    path: 'unlock-rewards',
    component: UnlockRewardsComponent,
    outlet: 'popup',
    canActivate: [ParentGuard, OnlyWebUsersGuard],
  },
  {
    path: 'badges/:type',
    component: BadgesComponent,
    outlet: 'popup',
    canActivate: [ParentGuard, OnlyWebUsersGuard],
  },
  {
    path: 'business-locked',
    component: BusinessAddedComponent,
    outlet: 'popup',
    canActivate: [ParentGuard, OnlyWebUsersGuard],
  },
  {
    path: 'rockstar',
    component: MaxLevelProducerComponent,
    outlet: 'popup',
    canActivate: [ParentGuard, OnlyWebUsersGuard],
  },

  {
    path: 'get-invitation',
    component: RequestInvitationComponent,
    outlet: 'popup',
    canActivate: [LoggedOutGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [ValidInvitationCodeGuard, ParentGuard],
})
export class ParentRoutingModule {
}
