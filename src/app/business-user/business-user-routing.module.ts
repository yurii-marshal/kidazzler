import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanUpgradeGuard } from '../core/guards/can-upgrade.guard';
import { PhoneVerifiedGuard } from '../core/guards/phone-verified.guard';
import { CheckOutComponent } from '../public/check-out/check-out.component';

import { BusinessListDetailsComponent } from './business-list/business-list-details/business-list-details.component';
import { BusinessPhotosComponent } from './business-photos/business-photos.component';
import { CheckinCodeComponent } from './checkin-code/checkin-code.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { CheckYourEmailComponent } from './check-your-email/check-your-email.component';

import { ClaimBusinessComponent } from './claim-business/claim-business.component';
import { DealDetailComponent } from './deals/deal-detail/deal-detail.component';
import { DealListComponent } from './deals/deal-list/deal-list.component';
import { DealPhotosComponent } from './deals/deal-photos/deal-photos.component';
import { DealComponent } from './deals/deal/deal.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { EventPhotosComponent } from './events/event-photos/event-photos.component';
import { EventComponent } from './events/event/event.component';
import { SearchBusinessComponent } from './search-business/search-business.component';
import { SignUpBusinessComponent } from './sign-up-business/sign-up-business.component';
import { BusinessEditComponent } from './business-edit/business-edit.component';
import { BusinessListComponent } from './business-list/business-list.component';
import { BusinessVerifiedComponent } from './business-verified/business-verified.component';
import { BusinessUserGuard } from './business-user.guard';
import { BusinessNeedLogoutComponent } from './business-need-logout/business-need-logout.component';
import { ListOfPhotosComponent } from '../shared/list-of-photos/list-of-photos.component';
import { BusinessLookupComponent } from './business-lookup/business-lookup.component';
import { EnterCodeComponent } from './enter-code/enter-code.component';
import { VerifyClaimComponent } from './verify-claim/verify-claim.component';
import { VerifyTransitionGuard } from './verify-transition.guard';
import { UpgradeBusinessComponent } from './upgarde-business/upgrade-business.component';

const routes: Routes = [
  {
    path: 'verify-claim',
    component: VerifyClaimComponent,
    canActivate: [VerifyTransitionGuard],
  },
  {
    path: 'claim-business/:id',
    component: ClaimBusinessComponent,
    canActivate: [BusinessUserGuard],
  },
  {
    path: 'enter-code/:id',
    component: EnterCodeComponent,
    canActivate: [BusinessUserGuard],
  },
  { path: 'business-lookup', component: BusinessLookupComponent },
  { path: 'business-sign-up', component: SignUpBusinessComponent },
  { path: 'business-logout', component: BusinessNeedLogoutComponent },
  {
    path: '',
    canActivateChild: [BusinessUserGuard],
    children: [
      {
        path: 'businesses',
        canActivate: [PhoneVerifiedGuard],
        children: [
          { path: '', component: BusinessListComponent },
          { path: 'add', component: BusinessEditComponent, pathMatch: 'full' },
          {
            path: ':id',
            children: [
              { path: '', component: BusinessListDetailsComponent },
              { path: 'edit', component: BusinessEditComponent },
              { path: 'photos', component: BusinessPhotosComponent },
              {
                path: 'deals',
                children: [
                  { path: '', component: DealListComponent },
                  { path: 'add', component: DealComponent },
                  {
                    path: ':dealId', children: [
                      { path: '', component: DealDetailComponent },
                      { path: 'edit', component: DealComponent },
                      { path: 'photos', component: DealPhotosComponent },
                    ],
                  },

                ],
              },
              {
                path: 'events',
                children: [
                  { path: '', component: EventListComponent },
                  { path: 'add', component: EventComponent },
                  {
                    path: ':eventId', children: [
                      { path: '', component: EventDetailComponent },
                      { path: 'edit', component: EventComponent },
                      { path: 'photos', component: EventPhotosComponent },
                    ],
                  },

                ],
              },
              { path: 'photos', component: ListOfPhotosComponent },
              { path: 'checkin-code', component: CheckinCodeComponent },
            ],
          },
        ],
      },
      { path: 'upgrade-business/:id', component: UpgradeBusinessComponent, canActivate: [CanUpgradeGuard] },
      { path: 'business-verified', component: BusinessVerifiedComponent },
      { path: 'search-business', component: SearchBusinessComponent },
      { path: 'search-result', component: SearchResultComponent },
      { path: 'check-email', component: CheckYourEmailComponent },
      {
        path: 'claim/:id',
        component: BusinessEditComponent,
        data: { action: 'verifyBusiness' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [BusinessUserGuard, VerifyTransitionGuard],
})
export class BusinessUserRoutingModule {
}
