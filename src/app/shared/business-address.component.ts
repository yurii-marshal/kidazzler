import { Component, Input } from '@angular/core';

import { Business } from '../core/shared/business.model';
import { BusinessDirection } from '../core/shared/enums/business-direction.enum';

@Component({
  selector: 'kz-business-address',
  template: `
    <ng-container *ngIf="displayingAddress">
      <div>{{ formatAddress() }}</div>
      <div>{{ formatRegion() }}</div>
    </ng-container>
  `,
})
export class BusinessAddressComponent {
  @Input('business') business: Business;

  constructor() {}

  get displayingAddress(): boolean {
    return this.business && this.business.businessDirection === BusinessDirection.Physical;
  }

  formatAddress(): string {
    return (
      (this.business.address || '') + (this.business.address2 ? ', ' + this.business.address2 : '')
    );
  }

  formatRegion(): string {
    return (
      (this.business.city ? this.business.city + ', ' : '') +
      (this.business.state || '')
      // +
      // (this.business.zip ? ' ' + this.business.zip : '')
    );
  }
}
