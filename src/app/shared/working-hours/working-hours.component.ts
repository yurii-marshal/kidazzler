import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { WorkingHours } from '../../core/shared/working-hours';
import { BusinessService } from '../../core/business.service';

@Component({
  selector: 'kz-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss'],
})
export class KzWorkingHoursComponent implements AfterViewInit, OnChanges {
  @Input() hours: WorkingHours;
  @Input() header: string;

  areWorkdaysSame: boolean;

  hoursWeek;
  workdays;

  constructor(
    private businessService: BusinessService,
  ) {
  }

  ngAfterViewInit() {
    if (!this.header) {
      this.header = 'Open Hours';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hours.currentValue && changes.hours.previousValue !== changes.hours.currentValue) {
      this.hoursWeek =
        this.businessService.getWeekdaysArray(
          Object.keys(this.hours).map(i => this.hours[i]),
          'MO',
        );

      this.workdays = this.hoursWeek.slice(0, 5);

      this.areWorkdaysSame = this.workdays.every((item) => {
        if (!item.hours.startAt) {
          return false;
        }

        return this.workdays[0].hours.startAt.getHours() === item.hours.startAt.getHours() &&
          this.workdays[0].hours.endAt.getHours() === item.hours.endAt.getHours();
      });
    }
  }
}
