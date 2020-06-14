import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BusinessService } from '../../../core/business.service';
import { Business } from '../../../core/shared/business.model';
import { Deal } from '../../../core/shared/deal.model';
import { untilComponentDestroyed } from '../../../shared/componentDestroyed';
import { Constants } from '../../../shared/constants';

interface AppWindow extends Window {
  postAppMessage(message: any): void;
}

declare let window: AppWindow;

@Component({
  selector: 'kz-deal-detail-on-portal',
  templateUrl: './deal-detail.component.html',
  styleUrls: ['./deal-detail.component.scss', '../../business-portal.scss'],
})
export class DealDetailComponent implements OnInit, OnDestroy {
  roles = Constants.Roles;
  deal: Deal;
  business: Business;

  constructor(
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private spinner: NgxUiLoaderService,
  ) {}

  ngOnInit() {
    this.spinner.start();
    const id = +this.route.snapshot.paramMap.get('id');
    const dealId = +this.route.snapshot.paramMap.get('dealId');
    this.businessService
      .getBusinessById(id)
      .pipe(untilComponentDestroyed(this))
      .subscribe(business => {
        this.business = business;
      });
    this.businessService
      .getDeal(id, dealId)
      .pipe(untilComponentDestroyed(this))
      .subscribe(
        (deal: Deal) => {
          this.deal = deal;
          this.deal['coverImg'] = this.deal.photos.find(photo => photo.primary);
        },
        () => {},
        () => {
          this.spinner.stop();
          // post message for mobile app
          setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 1200);
        },
      );
  }

  ngOnDestroy(): void {}
}
