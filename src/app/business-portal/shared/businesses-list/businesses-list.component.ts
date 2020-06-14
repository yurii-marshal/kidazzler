import { Component, Input, OnInit } from '@angular/core';
import { BusinessType } from '../../../core/shared/business-type.model';
import { Business } from '../../../core/shared/business.model';

@Component({
  selector: 'kz-businesses-list',
  templateUrl: './businesses-list.component.html',
  styleUrls: ['./businesses-list.component.scss'],
})
export class BusinessesListComponent implements OnInit {
  @Input() category: BusinessType;
  @Input() businesses: Business[];
  @Input() title: string;

  constructor() {}

  ngOnInit() {}
}
