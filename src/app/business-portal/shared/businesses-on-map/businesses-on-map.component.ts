import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { LngLatBounds, Map } from 'mapbox-gl';
import { ToastrService } from 'ngx-toastr';
import { Business } from '../../../core/shared/business.model';
import { SearchParams } from '../../../core/shared/search-params';
import { UserService } from '../../../core/user.service';
import { untilComponentDestroyed } from '../../../shared/componentDestroyed';
import { MapSearchErrorToastComponent } from '../../../shared/map-search-error-toast/map-search-error-toast.component';
import { UserProfile } from '../../../user/shared/user-profile.model';

@Component({
  selector: 'kz-businesses-on-map',
  templateUrl: './businesses-on-map.component.html',
  styleUrls: ['./businesses-on-map.component.scss'],
})
export class BusinessesOnMapComponent implements OnInit, OnChanges {
  map: Map;
  level: number;
  bounds: LngLatBounds;
  mapConfig: {
    center?: number[];
    zoom?: number[];
    maxZoom: number;
  };
  geometries: any;
  params: SearchParams = {};
  showMyLocation: boolean = false;
  myCoords = [];
  allowedGeolocation: boolean = false;
  @Input() width: number = 400;
  @Input() height: number = 400;
  @Input() businesses: Business[];
  @Input() isFullMap: boolean = false;
  @Input() showClose: boolean = false;
  @Input() showZoomControl: boolean = false;
  @Input() showSearchControl: boolean = true;
  @Input() showCurrentLocationControl: boolean = false;
  @Input() activeBusiness: Business;
  @Input() expanded: boolean = false;
  @Output() onLocationChange = new EventEmitter();
  @Output() onMarkerClick = new EventEmitter();

  isMobile: boolean;

  constructor(
    private toast: ToastrService,
    private userService: UserService,
    private location: Location,
  ) {
  }

  ngOnInit() {
    this.isMobile = this.userService.isMobile();

    this.mapConfig = {
      zoom: [5],
      maxZoom: 30,
    };
    if (this.businesses && !this.businesses.length) {
      this.showErrorToast();
      this.userService.getProfile().subscribe((profile: UserProfile) => {
        this.mapConfig.center = [profile.longitude, profile.latitude];
      });
    }


    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.myCoords = [position.coords.longitude, position.coords.latitude];
          this.allowedGeolocation = true;
        },
        err => {
          // TODO: make some manipulation if user denied geolocation
          this.allowedGeolocation = false;
        },
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['businesses'] && changes['businesses'].currentValue) {
      this.businesses = changes['businesses'].currentValue.filter(business => business.longitude && business.latitude);
      if (this.businesses.length) {
        this.fitBounds();
      } else {
        this.showErrorToast();
      }
    }
  }

  showErrorToast() {
    setTimeout(() =>
      this.toast.error('', 'Sorry, we couldn\'t find any matching places. Try expanding your search area to get more results.',
        { toastComponent: MapSearchErrorToastComponent }).onAction.subscribe((action) => {
        if (action === 'zoom') {
          if (this.mapConfig.zoom[0] > 0) {
            this.map.setZoom(this.map.getZoom() - 1);
            this.onCoordsChange();
            this.onSearch();
          }
        }
      }));
  }

  markerClick(business) {
    this.onMarkerClick.emit(business);
  }

  centerMapTo(coords): void {
    this.mapConfig.center = coords;
  }

  onCoordsChange(): void {
    if (this.map) {
      const boundArray = this.map.getBounds().toArray();
      this.params.coordinatesBox = [...boundArray[0], ...boundArray[1]].join(',');
      delete this.params.nearby;
    }
  }

  findCurrentLocation() {
    this.showMyLocation = true;
    this.centerMapTo(this.myCoords);
  }

  onSearch(): void {
    this.showMyLocation = false;
    this.onLocationChange.emit(this.params);
  }

  closeMap(): void {
    this.location.back();
  }

  fitBounds(): void {
    const coordinates = this.businesses.map((business: Business) => {
      if (business.latitude && business.longitude) {
        return [business.longitude, business.latitude];
      }
    });
    if (coordinates.length > 1) {
      this.bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(<any>coord);
      }, new LngLatBounds(<any>coordinates[0], <any>coordinates[0]));
    } else if (coordinates.length === 1) {
      this.centerMapTo(coordinates[0]);
    }
  }

}
