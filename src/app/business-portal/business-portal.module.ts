import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import 'hammerjs';
import { NgxHmCarouselModule } from 'ngx-hm-carousel';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from '../../environments/environment';
import { SharedModule } from '../shared/shared.module';
import { AllCategoriesComponent } from './all-categories/all-categories.component';
import { BusinessAboutComponent } from './business-about/business-about.component';
import { AboutComponent } from './business-detail/about/about.component';
import { BusinessDetailComponent } from './business-detail/business-detail.component';
import { BusinessInfoComponent } from './business-detail/business-info/business-info.component';
import { InfoTabsComponent } from './business-detail/info-tabs/info-tabs.component';
import { RelatedBusinessesComponent } from './business-detail/related-businesses/related-businesses.component';
import { BusinessPortalRoutingModule } from './business-portal-routing.module';
import { CheckInComponent } from './check-in/check-in.component';
import { DealDetailComponent } from './deal/deal-detail/deal-detail.component';
import { DealListComponent } from './deal/deal-list/deal-list.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { MainComponent } from './main/main.component';
import { SearchBoxComponent } from './main/search-box/search-box.component';
import { SliderComponent } from './main/slider/slider.component';
import { SearchFilterComponent } from './search-filter/search-filter.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SearchWithMapComponent } from './search-with-map/search-with-map.component';
import { SearchComponent } from './search/search.component';
import { BusinessesListComponent } from './shared/businesses-list/businesses-list.component';
import { CategoriesComponent } from './shared/categories/categories.component';
import { SubCategoriesComponent } from './sub-categories/sub-categories.component';
import { BusinessPhotosComponent } from './business-photos/business-photos.component';
import { DealPhotosComponent } from './deal/deal-photos/deal-photos.component';
import { EventPhotosComponent } from './events/event-photos/event-photos.component';
import { BusinessesOnMapComponent } from './shared/businesses-on-map/businesses-on-map.component';
import { BusinessPortalComponent } from './business-portal.component';
@NgModule({
  declarations: [
    BusinessPortalComponent,
    MainComponent,
    SliderComponent,
    SearchBoxComponent,
    CategoriesComponent,
    BusinessesListComponent,
    SubCategoriesComponent,
    SearchComponent,
    SearchResultComponent,
    SearchWithMapComponent,
    AllCategoriesComponent,
    CheckInComponent,
    BusinessDetailComponent,
    BusinessInfoComponent,
    InfoTabsComponent,
    AboutComponent,
    RelatedBusinessesComponent,
    SearchFilterComponent,
    BusinessAboutComponent,
    DealDetailComponent,
    DealListComponent,
    EventListComponent,
    EventDetailComponent,
    BusinessPhotosComponent,
    DealPhotosComponent,
    EventPhotosComponent,
    BusinessesOnMapComponent,
    EventListComponent,
    EventDetailComponent,
    DealPhotosComponent,
    EventPhotosComponent,
    BusinessesOnMapComponent,
  ],
  imports: [
    CommonModule,
    BusinessPortalRoutingModule,
    SharedModule,
    NgxHmCarouselModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapBoxAccessToken,
    }),
  ],
})
export class BusinessPortalModule {}
