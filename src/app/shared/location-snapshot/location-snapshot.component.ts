import { Component, Input, OnInit } from '@angular/core';
import { Business } from '../../core/shared/business.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'kz-location-snapshot',
  templateUrl: './location-snapshot.component.html',
  styleUrls: ['./location-snapshot.component.scss'],
})
export class LocationSnapshotComponent implements OnInit {
  locationUrl: string;
  googleMapUrl: string;

  @Input() business: Business;
  @Input() isShownDirectionBtn: boolean;

  constructor() {
  }

  ngOnInit() {
    if (this.business.longitude && this.business.latitude) {
      if ((navigator.platform.indexOf('iPhone') !== -1) ||
        (navigator.platform.indexOf('iPad') !== -1) ||
        (navigator.platform.indexOf('iPod') !== -1)) {
        this.googleMapUrl =
          `http://maps.apple.com/?daddr=${this.business.latitude},${this.business.longitude}&amp;ll=`;
      } else if (/(android)/i.test(navigator.userAgent)) {
        this.googleMapUrl =
          `geo:${this.business.latitude},${this.business.longitude}?z=17&q=${this.business.latitude},${this.business.longitude}`;
      } else {
        this.googleMapUrl =
          `https://maps.google.com/maps?daddr=${this.business.latitude},${this.business.longitude}&amp;ll=`;
      }

      this.locationUrl =
        `https://api.mapbox.com/styles/v1/mapbox/light-v9/static/${this.business.longitude},${this.business.latitude},16,0,0/${document.documentElement.clientWidth > 1280 ? 1280 : document.documentElement.clientWidth}x200?access_token=${environment.mapBoxAccessToken}`;
    }
  }

}
