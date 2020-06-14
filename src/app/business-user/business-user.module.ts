import { NgModule } from '@angular/core';

import { BusinessUserRoutingModule } from './business-user-routing.module';

import { ClaimBusinessComponent } from './claim-business/claim-business.component';
import { SignUpBusinessComponent } from './sign-up-business/sign-up-business.component';
import { BusinessEditComponent } from './business-edit/business-edit.component';
import { BusinessListComponent } from './business-list/business-list.component';
import { BusinessVerifiedComponent } from './business-verified/business-verified.component';
import { SharedModule } from '../shared/shared.module';
import { BusinessNeedLogoutComponent } from './business-need-logout/business-need-logout.component';
import { EditDealComponent } from './edit-deal/edit-deal.component';
import { SearchBusinessComponent } from './search-business/search-business.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { CheckYourEmailComponent } from './check-your-email/check-your-email.component';
import { EnterCodeComponent } from './enter-code/enter-code.component';
import { BusinessLookupComponent } from './business-lookup/business-lookup.component';

import { EventComponent } from './events/event/event.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { DealComponent } from './deals/deal/deal.component';
import { DealListComponent } from './deals/deal-list/deal-list.component';
import { DealDetailComponent } from './deals/deal-detail/deal-detail.component';
import { CheckinCodeComponent } from './checkin-code/checkin-code.component';
import { BusinessListCardComponent } from './business-list/business-list-card/business-list-card.component';
import { BusinessListDetailsComponent } from './business-list/business-list-details/business-list-details.component';
import { EventPhotosComponent } from './events/event-photos/event-photos.component';
import { DealPhotosComponent } from './deals/deal-photos/deal-photos.component';
import { BusinessPhotosComponent } from './business-photos/business-photos.component';
import { VerifyClaimComponent } from './verify-claim/verify-claim.component';
import { EditCheckinCodeComponent } from './edit-checkin-code/edit-checkin-code.component';
import { UpgradeBusinessComponent } from './upgarde-business/upgrade-business.component';

@NgModule({
  imports: [
    BusinessUserRoutingModule,
    SharedModule,
  ],
  declarations: [
    VerifyClaimComponent,
    UpgradeBusinessComponent,
    ClaimBusinessComponent,
    SignUpBusinessComponent,
    BusinessEditComponent,
    BusinessVerifiedComponent,
    BusinessListComponent,
    BusinessNeedLogoutComponent,
    EditDealComponent,
    EventComponent,
    EventDetailComponent,
    EventListComponent,
    DealComponent,
    DealListComponent,
    DealDetailComponent,
    CheckinCodeComponent,
    EditCheckinCodeComponent,
    BusinessListCardComponent,
    BusinessListDetailsComponent,
    EventPhotosComponent,
    DealPhotosComponent,
    BusinessPhotosComponent,
    SearchBusinessComponent,
    SearchResultComponent,
    CheckYourEmailComponent,
    EnterCodeComponent,
    BusinessLookupComponent,
  ],
})
export class BusinessUserModule {}
