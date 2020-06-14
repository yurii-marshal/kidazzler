import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'kz-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {
  openedBlocks = {
    1: false,
    2: false,
    3: false,
  };

  plans: any;
  businessId: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.businessId = this.route.snapshot.params['businessId'];
    this.plans = [
      { id: 1, period: 'Annual', price: 29.99, regularPrice: 59.99, billed: 'Annually' },
      { id: 2, period: '6 Months', price: 24.99, regularPrice: 54.99, billed: 'Every 6 Months' },
      { id: 3, period: 'Monthly', price: 19.99, regularPrice: 49.99, billed: 'Monthly' },
    ];
  }

  toggleBlock(i: number) {
    this.openedBlocks[i] = !this.openedBlocks[i];
  }

  choosePlan(type) {
    this.router.navigate(['business', this.businessId, 'check-out', type]);
  }
}
