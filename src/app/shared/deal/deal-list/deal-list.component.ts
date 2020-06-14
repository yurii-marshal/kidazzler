import { Component, Input, OnInit } from '@angular/core';
import { Business } from '../../../core/shared/business.model';

@Component({
  selector: 'kz-deal-list',
  templateUrl: './deal-list.component.html',
  styleUrls: ['./deal-list.component.scss'],
})
export class DealListComponent implements OnInit {
  @Input() deals: any;
  @Input() role: number;
  @Input() business: Business;

  constructor() {
  }

  ngOnInit() {
  }

}
