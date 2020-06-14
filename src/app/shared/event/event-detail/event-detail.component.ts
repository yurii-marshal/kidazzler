import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BusinessEvent } from '../../../core/shared/business-event';
import { environment } from '../../../../environments/environment';
import { Business } from '../../../core/shared/business.model';
import { DOCUMENT } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'kz-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit, OnChanges {
  @Input() user: number;
  @Input() event: BusinessEvent;
  @Input() business: Business;
  @Output() onAddPhotos = new EventEmitter();

  @ViewChild('scrollContainer') scrollContainer: ElementRef;

  isShownSharePopup = false;
  locationUrl: string;
  isReadMoreOpened: boolean = false;
  isOverflown: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private location: Location,
    private router: Router,
  ) {
    const obj = {};
    const map = this.getMapFromObject(obj);
    const obj2 = this.getObjectFromMap(map);
    console.log(obj2);
  }

  getObjectFromMap(map) {
    return Array.from(map.entries()).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as [any, any]);
  }

  getMapFromObject(obj) {
    return new Map(Object.keys(obj).reduce((acc, key) => acc.set(key, obj[key]), new Map()));
  }

  ngOnInit() {
    setTimeout(() => {
      this.isOverflown = this.scrollContainer.nativeElement.scrollHeight > this.scrollContainer.nativeElement.clientHeight;
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['business'] && changes['business'].currentValue) {
      if (this.business.longitude && this.business.latitude) {
        this.locationUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v9/static/${this.business.longitude},${this.business.latitude},16,0,0/${document.documentElement.clientWidth}x200?access_token=${environment.mapBoxAccessToken}`;
      }
    }
    if (changes['event'] && changes['event'].currentValue) {
      this.event = changes['event'].currentValue;
      this.event['coverImg'] = this.event.photos.find(photo => photo.primary) ||
        this.event.photos[0];
    }
  }

  saveToBookmarks() {
  }

  uploadPhotos(event) {
    const pictureInput = event.target;

    if (!pictureInput.files || !pictureInput.files[0]) {
      return;
    }
    const pictures: File = pictureInput.files;
    this.onAddPhotos.emit(pictures);
  }

  goBack() {
    this.router.navigate([this.router.url.replace(/[^\/]+$/, '')]);
  }

}
