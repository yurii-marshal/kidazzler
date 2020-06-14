import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';
import { BusinessPhoto } from '../../../core/shared/business-photo.model';
import { Business } from '../../../core/shared/business.model';
import { Deal } from '../../../core/shared/deal.model';
import { BusinessService } from '../../../core/business.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';
import { untilComponentDestroyed } from '../../componentDestroyed';

@Component({
  selector: 'kz-deal-card',
  templateUrl: './deal-card.component.html',
  styleUrls: ['./deal-card.component.scss'],
})
export class DealCardComponent implements OnInit, OnDestroy {
  @Input() deal: Deal;
  @Input() role: number;
  @Input() business: Business;

  selectedFile;
  businessId: number;
  primaryPhotoUrl: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private businessService: BusinessService,
              private spinner: NgxUiLoaderService,
              private toast: ToastrService) {
  }

  ngOnInit() {
    this.businessId = +this.route.snapshot.paramMap.get('id');
    const primaryPhoto = this.deal.photos[this.deal.photos.findIndex(el => el.primary)];
    this.primaryPhotoUrl = primaryPhoto && primaryPhoto.url || this.deal.photos.length && this.deal.photos[0].url || '../../../../assets/images/bg-landing.jpg';
  }

  viewDetails(businessId, dealId) {
    switch (this.role) {
      case 0:
        this.router.navigate(['businesses', businessId, 'deals', dealId]);
        break;
      case 1:
        this.router.navigate(['business-portal/business', businessId, 'deals', dealId]);
        break;
    }
  }

  redirectOnPhotoClick() {
    this.role ?
      this.router.navigate(['business-portal/business', this.business.id, 'deals', this.deal.id]) :
      this.router.navigate(['businesses', this.business.id, 'deals', this.deal.id, 'photos']);
  }

  addPhoto(event) {
    const pictureInput = event.target;

    if (!pictureInput.files || !pictureInput.files[0]) {
      return;
    }
    const pictures: File[] = pictureInput.files;

    for (let i = 0; i < pictures.length; i++) {
      this.businessService.uploadBusinessPicture(pictures[i])
        .subscribe((url) => {
            this.businessService.uploadDealPhoto(this.businessId, this.deal.id, { url: url })
              .subscribe((photo: BusinessPhoto) => {
                if (i === pictures.length - 1) {
                  this.primaryPhotoUrl = photo.url;
                  pictureInput.value = '';
                }
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
