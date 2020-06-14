import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

import { Subject, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as moment from 'moment';

import { UserNotificationService, UserNotification } from '../../core/user-notifications.service';
import { PaginatedData } from '../../core/shared/paginated-data';
import { dropdownDisplay } from '../../core/shared/animations';

@Component({
  selector: 'kz-header-notifications',
  templateUrl: './header-notifications.component.html',
  styleUrls: ['./header-notifications.component.scss'],
  animations: [dropdownDisplay],
})
export class HeaderNotificationsComponent implements OnInit {
  notifications: UserNotification[];
  isOpen = false;
  hasNew: boolean;

  @ViewChildren('notification') notificationsElements: QueryList<ElementRef>;
  @ViewChild(PerfectScrollbarDirective) scrollContainer: PerfectScrollbarDirective;

  private viewedNotificationsIds = new Set();
  private listScroll = new Subject();
  private listOpened = new Subject();

  constructor(private notificationService: UserNotificationService) {}

  ngOnInit() {
    this.getNotifications();

    merge(this.listOpened, this.listScroll.pipe(debounceTime(500))).subscribe(() =>
      this.updateViewedNotifications(),
    );
  }

  getNotifications() {
    this.notificationService
      .getNotifications()
      .subscribe((data: PaginatedData<UserNotification>) => {
        this.notifications = data.items;
        this.hasNew = this.notifications.some(notification => notification.isNew);
      });
  }

  @HostListener('mouseenter')
  show() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.listOpened.next();
  }

  @HostListener('mouseleave')
  hide() {
    this.isOpen = false;
  }

  onListScrollDown() {
    this.listScroll.next();
  }

  updateViewedNotifications() {
    if (!this.notifications || !this.notifications.length) return;

    const scrollOffset = this.scrollContainer['elementRef'].nativeElement.scrollTop;
    const listHeight = this.scrollContainer['elementRef'].nativeElement.offsetHeight;
    const deltaOffset = 20;

    this.notificationsElements.forEach((notificationElement, index) => {
      const offsetFromStart = notificationElement.nativeElement.offsetTop;
      const height = notificationElement.nativeElement.offsetHeight;

      if (
        offsetFromStart + height < scrollOffset + listHeight + deltaOffset &&
        this.notifications[index].isNew
      ) {
        this.notifications[index].isNew = false;
        this.viewedNotificationsIds.add(this.notifications[index].id);
      }
    });

    if (this.viewedNotificationsIds.size) {
      this.hasNew = this.notifications.some(notification => notification.isNew);

      this.notificationService
        .setRead(Array.from(this.viewedNotificationsIds.values()))
        .subscribe(() => {
          this.viewedNotificationsIds.clear();
        });
    }
  }

  formatDate(date: string): string {
    const wrappedDate = moment(date);
    const dateFormat = 'MMMM D, YYYY';

    if (moment().diff(wrappedDate, 'days') > 1) {
      return wrappedDate.format(dateFormat);
    } else {
      return wrappedDate.fromNow();
    }
  }
}
