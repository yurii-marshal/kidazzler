import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BusinessService } from '../../../core/business.service';
import { BusinessPhoto } from '../../../core/shared/business-photo.model';
import { untilComponentDestroyed } from '../../../shared/componentDestroyed';
import { Constants } from '../../../shared/constants';

interface AppWindow extends Window {
  postAppMessage(message: any): void;
}

declare let window: AppWindow;

@Component({
  selector: 'kz-deal-photos',
  templateUrl: './deal-photos.component.html',
  styleUrls: ['./deal-photos.component.scss', '../../business-portal.scss'],
})
export class DealPhotosComponent implements OnInit, OnDestroy {
  roles = Constants.Roles;
  businessId: number;
  photos: BusinessPhoto[];
  dealId: number;

  constructor(private route: ActivatedRoute, private spinner: NgxUiLoaderService, private businessService: BusinessService, private toast: ToastrService) {
  }

  ngOnInit() {
    this.businessId = +this.route.snapshot.paramMap.get('id');
    this.dealId = +this.route.snapshot.paramMap.get('dealId');
    this.spinner.start();
    this.businessService.getDealPhotos(this.businessId, this.dealId).pipe(untilComponentDestroyed(this))
      .subscribe(({ items }) => {
        this.photos = items;
        this.spinner.stop();
        // post message for mobile app
        setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 500);
      }, (err) => {
        this.spinner.stop();
        // post message for mobile app
        setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 500);
        const message = err.error.message || err.message;
        this.toast.error(message);
      }, () => {
      });
  }

  ngOnDestroy(): void {
  }
}
