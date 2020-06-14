import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BusinessService } from '../../../core/business.service';
import { Deal } from '../../../core/shared/deal.model';
import { untilComponentDestroyed } from '../../../shared/componentDestroyed';

@Component({
  selector: 'kz-deal-business-user',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.scss', '../../business-user.scss'],
})
export class DealComponent implements OnInit, OnDestroy {
  dealId: number = null;
  businessId: number = null;
  deal: Deal = {};

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private location: Location,
    private spinner: NgxUiLoaderService,
    private router: Router,
    private toast: ToastrService,
  ) {
  }

  ngOnInit() {
    this.dealId = +this.route.snapshot.paramMap.get('dealId');
    this.businessId = +this.route.snapshot.paramMap.get('id');
  }

  deleteDeal() {
    this.businessService.deleteDeal(this.businessId, this.dealId)
      .subscribe(() => {
        this.location.back();
      }, (err) => {
        const message = err.error.message || err.message;
        this.toast.error(message);
      });
  }

  submit(form): void {
    this.spinner.startLoader('submit-deal');
    if (this.dealId) {
      this.businessService
        .editDeal(this.businessId, this.dealId, form as Deal)
        .pipe(untilComponentDestroyed(this))
        .subscribe(
          () => {
            this.router.navigate(['businesses', this.businessId, 'deals']);
            this.spinner.stopLoader('submit-deal');

          },
          (err) => {
            this.toast.error(err.error.message || err.message);
            this.spinner.stopLoader('submit-deal');

          },
          () => {
          },
        );
    } else {
      this.businessService
        .addDeal(this.businessId, form)
        .pipe(untilComponentDestroyed(this))
        .subscribe(
          () => {
            this.router.navigate(['businesses', this.businessId, 'deals']);
            this.spinner.stopLoader('submit-deal');

          },
          (err) => {
            this.toast.error(err.error.message || err.message);
            this.spinner.stopLoader('submit-deal');

          },
          () => {
          },
        );
    }
  }

  ngOnDestroy(): void {
  }
}
