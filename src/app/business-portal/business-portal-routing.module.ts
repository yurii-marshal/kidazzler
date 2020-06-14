import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

import { CheckLocationGuard } from '../core/guards/check-location.guard';
import { MobileDashboardComponent } from '../user/mobile-dashboard/mobile-dashboard.component';

import { AllCategoriesComponent } from './all-categories/all-categories.component';
import { BusinessDetailComponent } from './business-detail/business-detail.component';
import { BusinessPhotosComponent } from './business-photos/business-photos.component';
import { CheckInComponent } from './check-in/check-in.component';
import { DealPhotosComponent } from './deal/deal-photos/deal-photos.component';
import { DealDetailComponent } from './deal/deal-detail/deal-detail.component';
import { DealListComponent } from './deal/deal-list/deal-list.component';
import { EventPhotosComponent } from './events/event-photos/event-photos.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { MainComponent } from './main/main.component';
import { SearchFilterComponent } from './search-filter/search-filter.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SearchWithMapComponent } from './search-with-map/search-with-map.component';
import { SearchComponent } from './search/search.component';
import { SetLocationComponent } from './set-location/set-location.component';
import { SubCategoriesComponent } from './sub-categories/sub-categories.component';
import { BusinessPortalComponent } from './business-portal.component';
import { AddToCalendarComponent } from './events/add-to-calendar/add-to-calendar.component';

const routes: Routes = [
  {
    path: 'business-portal',
    component: BusinessPortalComponent,
    canActivate: [CheckLocationGuard],
    children: [
      { path: '', component: MainComponent },
      {
        path: 'business',
        children: [
          { path: ':id', component: BusinessDetailComponent },
          { path: ':id/photos', component: BusinessPhotosComponent },
          { path: ':id/check-in', component: CheckInComponent },
          {
            path: ':id/deals',
            children: [
              { path: '', component: DealListComponent },
              { path: ':dealId', component: DealDetailComponent },
              { path: ':dealId/photos', component: DealPhotosComponent },
            ],
          },
          {
            path: ':id/events',
            children: [
              { path: '', component: EventListComponent },
              { path: ':eventId', component: EventDetailComponent },
              { path: ':eventId/photos', component: EventPhotosComponent },
              { path: ':eventId/add-to-calendar', component: AddToCalendarComponent },
            ],
          },
        ],
      },
      { path: 'category/:id/sub-categories', component: SubCategoriesComponent },
      { path: 'search', component: SearchComponent },
      { path: 'search-filter', component: SearchFilterComponent },
      { path: 'all-categories', component: AllCategoriesComponent },
      { path: 'search-with-map', component: SearchWithMapComponent },
      { path: 'search-result', component: SearchResultComponent },
      { path: 'all-categories', component: AllCategoriesComponent },
    ],
  },
  { path: 'set-location', component: SetLocationComponent },
  { path: 'mobile', component: MobileDashboardComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessPortalRoutingModule {
}
