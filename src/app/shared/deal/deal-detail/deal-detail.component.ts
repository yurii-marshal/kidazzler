import { Location } from '@angular/common';
import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Business } from '../../../core/shared/business.model';
import { Deal } from '../../../core/shared/deal.model';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'kz-deal-detail',
  templateUrl: './deal-detail.component.html',
  styleUrls: ['./deal-detail.component.scss'],
})
export class DealDetailComponent implements OnInit, OnDestroy {

  @Input() user: number;
  @Input() deal: Deal;
  @Input() business: Business;

  stickyTabs = false;
  isShownSharePopup = false;
  externalLinkToDeal = '';

  constructor(private location: Location, private router: Router) {
  }

  ngOnInit() {
    if (this.business) {
      this.externalLinkToDeal = `${environment.url}/business-portal/business/${this.business.id}/deals/${this.deal.id}`;
    }
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.stickyTabs = window.pageYOffset >= 602;
  }

  saveToBookmarks() {
  }

  openImagesList() {
    switch (this.user) {
      case 0:
        this.router.navigate(['businesses', this.business.id, 'deals', this.deal.id, 'photos']);
        break;
      case 1:
        this.router.navigate(['business-portal/business', this.business.id, 'deals', this.deal.id, 'photos']);
        break;
    }
  }

  goBack() {
    this.router.navigate([this.router.url.replace(/[^\/]+$/, '')]);
  }

  ngOnDestroy(): void {
  }

}
