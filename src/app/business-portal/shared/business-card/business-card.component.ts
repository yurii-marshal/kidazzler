import { Component, Input, OnInit } from '@angular/core';
import { BusinessType } from '../../../core/shared/business-type.model';
import { Business } from '../../../core/shared/business.model';

@Component({
  selector: 'kz-business-card',
  templateUrl: './business-card.component.html',
  styleUrls: ['./business-card.component.scss'],
})
export class BusinessCardComponent implements OnInit {
  @Input() business: Business;
  @Input() category: BusinessType;
  @Input() direction: string;
  @Input() additionalClass: string;
  @Input() isLongTitle = false;

  constructor() {}

  ngOnInit() {}
}
