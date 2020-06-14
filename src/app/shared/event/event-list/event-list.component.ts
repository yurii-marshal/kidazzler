import { Component, Input, OnInit } from '@angular/core';
import { BusinessEvent } from '../../../core/shared/business-event';
import { Business } from '../../../core/shared/business.model';

@Component({
  selector: 'kz-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  @Input() events: BusinessEvent[];
  @Input() role: number;
  @Input() business: Business;

  constructor() {
  }

  ngOnInit() {
  }

}
