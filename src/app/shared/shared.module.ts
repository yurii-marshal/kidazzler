import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons/faGooglePlusG';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgBusyModule } from 'ng-busy';
import { ClipboardModule } from 'ngx-clipboard';
import { MomentModule } from 'ngx-moment';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SelectButtonModule } from 'primeng/primeng';
import {
  AutoCompleteModule,
  CalendarModule,
  CardModule,
  CarouselModule,
  DialogModule,
  DropdownModule,
  InputMaskModule,
  PaginatorModule,
  RadioButtonModule,
  TooltipModule,
  CheckboxModule,
  ProgressSpinnerModule,
} from 'primeng/primeng';

import { ShareOptionsModalComponent } from '../business-portal/shared/share-options-modal/share-options-modal.component';

import { AddNewBusinessBlockComponent } from './add-new-business-block/add-new-business-block.component';
import { AmpmPipe } from './ampm.pipe';
import { BusinessAddressComponent } from './business-address.component';
import { CapitalizePipe } from './capitalize.pipe';
import { MaxLengthDirective } from './cMaxLength.directive';
import { ComingSoonDirective } from './coming-soon.directive';
import { DealCardComponent } from './deal/deal-card/deal-card.component';
import { DealDetailComponent } from './deal/deal-detail/deal-detail.component';
import { DealListComponent } from './deal/deal-list/deal-list.component';
import { DealComponent } from './deal/deal/deal.component';
import { DiscountInputDirective } from './discount-input.directive';
import { EventCardComponent } from './event/event-card/event-card.component';
import { EventDetailComponent } from './event/event-detail/event-detail.component';
import { EventListComponent } from './event/event-list/event-list.component';
import { EventComponent } from './event/event/event.component';
import { FacebookAuthComponent } from './facebook-auth/facebook-auth.component';
import { FooterComponent } from './footer/footer.component';
import {
  KzFormFieldComponent,
  KzFormGroupComponent,
} from './forms/form-field/form-field.component';
import { KzFormDirective } from './forms/form.directive';
import { HeaderNotificationsComponent } from './header-notifications/header-notifications.component';
import { HeaderProfileComponent } from './header-profile/header-profile.component';
import { HeaderComponent } from './header/header.component';
import { HighlightPipe } from './highlight.pipe';
import { InputSwitcherComponent } from './input-switcher/input-switcher.component';
import { KzListInputComponent } from './list-input/list-input.component';
import { ListOfPhotosComponent } from './list-of-photos/list-of-photos.component';
import { LocationPickerComponent } from './location-picker/location-picker.component';
import { LocationSnapshotComponent } from './location-snapshot/location-snapshot.component';
import { MapSearchErrorToastComponent } from './map-search-error-toast/map-search-error-toast.component';
import { MobileAppsComponent } from './mobile-apps/mobile-apps.component';
import { NameTransformation } from './name-transformation.directive';
import { NoWhitespaceDirective } from './no-whitespace.directive';
import { PhoneNumberForCallPipe } from './phone-number-for-call.pipe';
import { PhonePipe } from './phone.pipe';
import { PhotoAuthorNamePipe } from './photo-author-name.pipe';
import { PreventInputValidatorDirective } from './prevent-input-validator.directive';
import { RecaptchaComponent } from './recaptcha.component';
import { SafePipe } from './safe.pipe';
import { ShortenStatePipe } from './shorten-state.pipe';
import { KzSelectComponent } from './select/select.component';
import { ShortenCountryPipe } from './shorten-country.pipe';
import { SortPipe } from './sort.pipe';
import { TimeAgoPipe } from './time-ago.pipe';
import { TitleHeaderComponent } from './title-header/title-header.component';
import { ToSelectAgePipe } from './to-select-age.pipe';
import { WeekdaysShortPipe } from './weekdays-short.pipe';
import { KzWorkingHoursComponent } from './working-hours/working-hours.component';
import { GlobalSearchComponent } from './global-search/global-search.component';
import { BusinessCardComponent } from '../business-portal/shared/business-card/business-card.component';
import { SetLocationComponent } from '../business-portal/set-location/set-location.component';
import { HeaderSearchComponent } from '../business-portal/shared/header-search/header-search.component';
import { AddToCalendarComponent } from '../business-portal/events/add-to-calendar/add-to-calendar.component';
import { BusinessHeaderComponent } from './business-header/business-header.component';

const icons = [faFacebookF, faTwitter, faLinkedinIn, faGooglePlusG, faEnvelope, faWhatsapp];

library.add(...icons);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PerfectScrollbarModule,
    AngularSvgIconModule,
    TooltipModule,
    AutoCompleteModule,
    DialogModule,
    FontAwesomeModule,
    NgxUiLoaderModule,
    SelectButtonModule,
    RadioButtonModule,
    CalendarModule,
    DropdownModule,
    ReactiveFormsModule,
    CheckboxModule,
    PinchZoomModule,
    ClipboardModule,
    ShareButtonsModule,
    AutocompleteLibModule,
    ProgressSpinnerModule,
  ],
  declarations: [
    NameTransformation,
    BusinessAddressComponent,
    HeaderComponent,
    HeaderNotificationsComponent,
    HeaderProfileComponent,
    FooterComponent,
    InputSwitcherComponent,
    RecaptchaComponent,
    FacebookAuthComponent,
    PhonePipe,
    MobileAppsComponent,
    KzFormFieldComponent,
    KzFormDirective,
    KzFormGroupComponent,
    KzSelectComponent,
    KzWorkingHoursComponent,
    KzListInputComponent,
    NoWhitespaceDirective,
    DiscountInputDirective,
    SafePipe,
    HighlightPipe,
    ToSelectAgePipe,
    LocationPickerComponent,
    TimeAgoPipe,
    CapitalizePipe,
    ShortenCountryPipe,
    ShortenStatePipe,
    AmpmPipe,
    MaxLengthDirective,
    DealListComponent,
    DealCardComponent,
    DealComponent,
    EventComponent,
    DealDetailComponent,
    EventListComponent,
    EventDetailComponent,
    AddToCalendarComponent,
    TitleHeaderComponent,
    EventCardComponent,
    ListOfPhotosComponent,
    LocationSnapshotComponent,
    PhotoAuthorNamePipe,
    PreventInputValidatorDirective,
    MapSearchErrorToastComponent,
    PhoneNumberForCallPipe,
    ShareOptionsModalComponent,
    WeekdaysShortPipe,
    SortPipe,
    AddNewBusinessBlockComponent,
    ComingSoonDirective,
    BusinessHeaderComponent,
    BusinessCardComponent,
    HeaderSearchComponent,
    SetLocationComponent,
    GlobalSearchComponent,
    BusinessHeaderComponent,
  ],
  exports: [
    NameTransformation,
    BusinessAddressComponent,
    HeaderComponent,
    BusinessHeaderComponent,
    HeaderNotificationsComponent,
    HeaderProfileComponent,
    FooterComponent,
    InputSwitcherComponent,
    RecaptchaComponent,
    FacebookAuthComponent,
    PhonePipe,
    SafePipe,
    HighlightPipe,
    MobileAppsComponent,
    KzFormDirective,
    KzFormFieldComponent,
    KzFormGroupComponent,
    KzSelectComponent,
    KzWorkingHoursComponent,
    KzListInputComponent,
    NoWhitespaceDirective,
    DiscountInputDirective,
    ToSelectAgePipe,
    LocationPickerComponent,
    TimeAgoPipe,
    CapitalizePipe,
    ShortenStatePipe,
    ShortenCountryPipe,
    AmpmPipe,
    MaxLengthDirective,
    DealListComponent,
    DealCardComponent,
    DealComponent,
    EventComponent,
    DealDetailComponent,
    EventListComponent,
    EventDetailComponent,
    AddToCalendarComponent,
    TitleHeaderComponent,
    EventCardComponent,
    ListOfPhotosComponent,
    LocationSnapshotComponent,
    PhotoAuthorNamePipe,
    PreventInputValidatorDirective,
    MapSearchErrorToastComponent,
    PhoneNumberForCallPipe,
    ShareOptionsModalComponent,
    WeekdaysShortPipe,
    SortPipe,
    AddNewBusinessBlockComponent,
    ComingSoonDirective,
    BusinessCardComponent,
    HeaderSearchComponent,
    GlobalSearchComponent,
    SetLocationComponent,
    BusinessHeaderComponent,

    // Angular modules
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,

    // 3-rd party modules
    MomentModule,
    AngularSvgIconModule,
    PerfectScrollbarModule,
    NgBusyModule,
    NgxUiLoaderModule,
    ShareButtonsModule,
    PinchZoomModule,
    ClipboardModule,
    AutocompleteLibModule,

    /// primeng
    DialogModule,
    InputMaskModule,
    DropdownModule,
    PaginatorModule,
    SelectButtonModule,
    RadioButtonModule,
    TooltipModule,
    AutoCompleteModule,
    CalendarModule,
    CarouselModule,
    CardModule,
    ProgressSpinnerModule,

    // font-awesome
    FontAwesomeModule,
  ],
  providers: [ShortenStatePipe],
})
export class SharedModule {

}
