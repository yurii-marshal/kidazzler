import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { BusinessService } from '../../core/business.service';

import { Business } from '../../core/shared/business.model';

@Component({
  selector: 'kz-business-about',
  templateUrl: './business-about.component.html',
  styleUrls: ['./business-about.component.scss'],
})
export class BusinessAboutComponent implements OnInit, OnDestroy {
  id;
  areWorkdaysEmpty: boolean;
  @Input() business: Business;
  @Output() onClose = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.areWorkdaysEmpty = Object.keys(this.business.workingHours).every(x => this.business.workingHours[x] === null);
  }

  ngOnDestroy(): void {
  }

  updateAbout() {
  }

  goBack() {
    this.onClose.emit();
  }
}
