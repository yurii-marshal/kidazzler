import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BusinessService } from '../../../core/business.service';
import { BusinessPhoto } from '../../../core/shared/business-photo.model';
import { Business } from '../../../core/shared/business.model';
import { Deal } from '../../../core/shared/deal.model';
import { untilComponentDestroyed } from '../../../shared/componentDestroyed';
import { Constants } from '../../../shared/constants';

@Component({
  selector: 'kz-deal-detail-business-user',
  templateUrl: './deal-detail.component.html',
  styleUrls: ['./deal-detail.component.scss', '../../business-user.scss'],
})
export class DealDetailComponent implements OnInit, OnDestroy {
  roles = Constants.Roles;
  deal: Deal;
  business: Business;

  constructor(
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private spinner: NgxUiLoaderService,
    private router: Router,
    private toast: ToastrService,
  ) {
  }

  ngOnInit() {
    this.spinner.start();
    const id = +this.route.snapshot.paramMap.get('id');
    const dealId = +this.route.snapshot.paramMap.get('dealId');
    this.businessService
      .getDeal(id, dealId)
      .pipe(untilComponentDestroyed(this))
      .subscribe(
        (deal: Deal) => {
          this.deal = deal;
        },
        () => {
        },
        () => {
          this.spinner.stop();
        },
      );
    this.businessService
      .getBusinessById(id)
      .pipe(untilComponentDestroyed(this))
      .subscribe(business => {
        this.business = business;
      });
  }

  onDealEdit() {
    this.router.navigate(['/businesses', this.business.id, 'deals', this.deal.id, 'edit']);
  }

  addPhotos(pictures: File[]) {
    this.spinner.startLoader('add-photo');

    for (let i = 0; i < pictures.length; i++) {
      this.businessService.uploadBusinessPicture(pictures[i])
        .subscribe((url) => {
            this.businessService.uploadDealPhoto( this.business.id, this.deal.id, { url: url })
              .subscribe((photo: BusinessPhoto) => {
                if (i === pictures.length - 1) {
                  this.spinner.stopLoader('add-photo');
                }
                this.router.navigate(['/businesses', this.business.id, 'deals', this.deal.id, 'photos']);
              });
          },
          err => {
            if (i === pictures.length - 1) {
              this.spinner.stopLoader('add-photo');
            }
            const message = err.error.message || err.message;
            this.toast.error(message);
          },
        );
    }
  }

  ngOnDestroy(): void {
  }
}
