import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusinessPortalService } from '../../../core/business-portal.service';
import { untilComponentDestroyed } from '../../../shared/componentDestroyed';
import { Business } from '../../../core/shared/business.model';

@Component({
  selector: 'kz-related-businesses',
  templateUrl: './related-businesses.component.html',
  styleUrls: ['./related-businesses.component.scss'],
})
export class RelatedBusinessesComponent implements OnInit, OnDestroy {
  businesses: Business[];
  isLoaded = false;

  constructor(private businessPortalService: BusinessPortalService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.businessPortalService
      .getRelatedBusinesses(id, {})
      .pipe(untilComponentDestroyed(this))
      .subscribe(response => {
        this.isLoaded = true;
        this.businesses = response.items;
      });
  }

  ngOnDestroy(): void {
  }
}
