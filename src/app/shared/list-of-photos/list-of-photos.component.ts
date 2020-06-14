import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BadgesService } from '../../core/badges.service';
import { BusinessService } from '../../core/business.service';
import { BusinessPhoto } from '../../core/shared/business-photo.model';
import { Business } from '../../core/shared/business.model';
import { UserService } from '../../core/user.service';
import { UserRole } from '../../core/shared/enums/user-role.enum';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'kz-list-of-photos',
  templateUrl: './list-of-photos.component.html',
  styleUrls: ['./list-of-photos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListOfPhotosComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isBusinessOwner: boolean = false;
  @Input() showAllTabs: boolean = true;
  @Input() showUpload: boolean = true;
  @Input() showAllTab: boolean = false;
  @Input() showAddedByBusinessTab: boolean = false;
  @Input() showAddedByUsersTab: boolean = false;
  @Input() role: number;
  @Input() defaultFilterType: 'member' | 'all' | 'business';
  @Input() photos: BusinessPhoto[];
  @Output() onDeletePhoto = new EventEmitter<BusinessPhoto>();
  @Output() onAddPhotos = new EventEmitter();
  @Output() onMakePrimary = new EventEmitter();
  @ViewChild('img') imgElement: ElementRef;

  selectedPhoto: BusinessPhoto;
  filterByType: 'member' | 'all' | 'business';
  filteredViewList: BusinessPhoto[] = [];
  businessId: number;
  dealId: number;
  eventId: number;
  photoScale: number = 0;
  showDeletePopup: boolean = false;
  producersObj: any = {};
  business: Business;
  isBusinessUser: boolean;

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private spinner: NgxUiLoaderService,
    private location: Location,
    private userService: UserService,
    private badgesService: BadgesService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['photos'] && changes['photos'].currentValue) {
      this.photos = changes['photos'].currentValue;
      this.showPhotos(this.filterByType);
    }
  }

  ngOnInit() {
    this.filterByType = this.defaultFilterType || 'all';
    this.businessId = +this.route.snapshot.paramMap.get('id');
    this.dealId = +this.route.snapshot.paramMap.get('dealId');
    this.eventId = +this.route.snapshot.paramMap.get('eventId');

    this.badgesService.getBadges()
      .subscribe((badges) => {
        badges.map((badge) => {
          this.producersObj[badge.id] = badge.title;
        });
      });

    combineLatest(
      this.businessService.getBusinessById(this.businessId),
      this.userService.getProfileSnapshot(),
    )
      .subscribe(([business, profile]) => {
        this.business = business;
        this.isBusinessUser = profile.role === UserRole.Business;
      });
  }

  openPhoto(photo: any) {
    this.selectedPhoto = photo;
  }

  onPinch(event) {
    this.photoScale = event.scale;
  }

  uploadPhotos(event) {
    const pictureInput = event.target;

    if (!pictureInput.files || !pictureInput.files[0]) {
      return;
    }
    const pictures: File = pictureInput.files;
    this.onAddPhotos.emit(pictures);
  }

  getCurrentPhotoIndex(selectedPhoto): number {
    return this.filteredViewList.findIndex(photo => selectedPhoto.url === photo.url);
  }

  showPhotos(type) {
    this.filterByType = type;
    switch (type) {
      case 'all':
        this.filteredViewList = [...this.photos];
        break;
      case 'business':
        this.filteredViewList = this.photos.filter(p => !p.uploadedByCustomer);
        break;
      case 'member':
        this.filteredViewList = this.photos.filter(p => p.uploadedByCustomer);
        break;
      default:
        this.filteredViewList = [...this.photos];
        break;
    }
  }

  closePhoto() {
    this.selectedPhoto = null;
  }

  swipeLeft() {
    if (this.photoScale < 1) {
      let i = this.getCurrentPhotoIndex(this.selectedPhoto);
      i = i < this.filteredViewList.length - 1 ? i + 1 : 0;
      this.selectedPhoto = this.filteredViewList[i];
    }
  }

  swipeRight() {
    if (this.photoScale < 1) {
      let i = this.getCurrentPhotoIndex(this.selectedPhoto);
      i = i > 0 ? i - 1 : this.filteredViewList.length - 1;
      this.selectedPhoto = this.filteredViewList[i];
    }
  }

  changePhotoStatus(photo) {
    this.onMakePrimary.emit(photo);
  }

  goBack() {
    this.location.back();
  }

  onDelete() {
    this.showDeletePopup = true;
  }

  deletePhoto(photo) {
    this.onDeletePhoto.emit(photo);
    this.showDeletePopup = false;
    this.closePhoto();
  }

  ngOnDestroy(): void {
  }
}
