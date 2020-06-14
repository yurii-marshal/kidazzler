import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BusinessService } from '../../core/business.service';
import { RouterExtService } from '../../core/router-ext.service';
import { BusinessPhoto } from '../../core/shared/business-photo.model';
import { Business } from '../../core/shared/business.model';
import { Location } from '@angular/common';
import { BusinessDirection } from '../../core/shared/enums/business-direction.enum';
import { UserRole } from '../../core/shared/enums/user-role.enum';
import { PhoneInfo } from '../../core/shared/phone-info';
import { UserService } from '../../core/user.service';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';
import { UserProfile } from '../../user/shared/user-profile.model';
import { BusinessPortalService } from '../../core/business-portal.service';
import { environment } from '../../../environments/environment';

interface AppWindow extends Window {
  postAppMessage(message: any): void;
}

declare let window: AppWindow;

@Component({
  selector: 'kz-business-detail',
  templateUrl: './business-detail.component.html',
  styleUrls: ['./business-detail.component.scss', '../business-portal.scss'],
})
export class BusinessDetailComponent implements OnInit, OnDestroy {
  business: Business;
  stickyHeader = false;
  stickyTabs = false;
  stickyFooter = false;
  isShownSharePopup = false;
  UserRole = UserRole;
  profile: UserProfile;
  photos: BusinessPhoto[];
  phoneInfo$: Observable<PhoneInfo>;
  externalLinkToBusiness: string;
  params: any;
  history: any;
  level: number;

  constructor(
    private businessService: BusinessService,
    private businessPortalService: BusinessPortalService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private spinner: NgxUiLoaderService,
    private routerExtService: RouterExtService,
  ) {
  }

  get isPhysical(): boolean {
    return this.business.businessDirection === BusinessDirection.Physical;
  }

  ngOnInit() {
    this.route.queryParams.pipe(untilComponentDestroyed(this)).subscribe((params) => {
      this.params = { ...params };
    });

    this.phoneInfo$ = this.userService
      .getProfile()
      .pipe(map(profile => ({ code: profile.phoneCode, mask: profile.phoneMask })));
    const id = +this.route.snapshot.paramMap.get('id');
    this.spinner.start();
    this.userService.getProfile().pipe(map((profile) => this.profile = profile));

    forkJoin(
      this.businessService.getBusinessById(id),
      this.businessService.getBusinessPhotos(id, { limit: 3 }),
    ).pipe(untilComponentDestroyed(this))
      .subscribe(([business, { items }]) => {
          this.business = business;
          this.photos = items;
          this.externalLinkToBusiness = `${environment.url}/business-portal/business/${this.business.id}`;
          this.spinner.stop();
          // post message for mobile app
          setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 1200);
        }, () => {
          this.spinner.stop();
          // post message for mobile app
          setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 1200);
        },
      );
  }

  goBack() {
    const previous = this.routerExtService.getPreviousUrl();
    if (previous.match(/deals|events/)) {
      this.history = history;
      this.history.go(-3);
    } else {
      this.location.back();
    }
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.stickyHeader = window.pageYOffset >= 273;
    this.stickyTabs = window.pageYOffset >= 602;
    this.stickyFooter = window.pageYOffset >= 500;
  }

  ngOnDestroy(): void {
  }
}

