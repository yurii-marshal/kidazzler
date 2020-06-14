import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as linker from 'autolinker';

import { ApiService } from './api.service';
import { PaginatedData } from './shared/paginated-data';
import { environment } from '../../environments/environment';

export enum UserNotificationType {
  REFERRAL_JOINED = 1,
  REFERRAL_PROMOTION = 2,
  BUSINESS_CLAIMED = 3,
  USER_PROMOTION = 4,
  ANNOUNCEMENT = 5,
  FOLLOWER_REQUEST_ACCEPTED = 6,
  BUSINESS_BECAME_MEMBER = 7,
}

export interface UserNotification {
  id: number;
  type: UserNotificationType;
  name: string;
  text: SafeHtml;
  imageUrl: string;
  isNew: boolean;
  createdAt: string;
}

const BUSINESS_IMAGE_URI =
  '/assets/images/notifications/business-placeholder/business-placeholder.png';
const ANNOUNCEMENT_IMAGE_URI = '/assets/images/notifications/kidazzler.png';

@Injectable()
export class UserNotificationService {
  constructor(private api: ApiService, private sanitizer: DomSanitizer) {}

  getNotifications(): Observable<PaginatedData<UserNotification>> {
    return this.api.get('notifications?limit=200').pipe(
      map((data: any) => {
        if (data['items'].length > 0) {
          data['items'] = data['items'].map(notificationData =>
            this.getNotification(notificationData),
          );
        }

        return data;
      }),
    );
  }

  setRead(ids): Observable<null> {
    return this.api.put('notifications', { ids });
  }

  private getNotification(notification: any): UserNotification {
    let notificationText = notification.text;
    const sanitizeText = text => this.sanitizer.sanitize(SecurityContext.HTML, text);

    switch (notification.type) {
      case UserNotificationType.REFERRAL_JOINED:
        notificationText = `Your friend <b>${sanitizeText(notification.name)}</b> joined`;
        notification.imageUrl = notification.imageUrl || environment.defaultAvatarUrl;
        break;
      case UserNotificationType.BUSINESS_CLAIMED:
        notificationText = `<b>${sanitizeText(notification.name)}</b> claimed their listing`;

        if (!notification.imageUrl) notification.imageUrl = BUSINESS_IMAGE_URI;
        break;
      case UserNotificationType.ANNOUNCEMENT:
        notification.imageUrl = ANNOUNCEMENT_IMAGE_URI;
        notificationText = this.linkify(sanitizeText(notification.text));
        break;
      case UserNotificationType.FOLLOWER_REQUEST_ACCEPTED:
        notification.imageUrl = notification.imageUrl || environment.defaultAvatarUrl;
        break;
      case UserNotificationType.BUSINESS_BECAME_MEMBER:
        notificationText = `<b>${sanitizeText(notification.name)}</b> became a Member`;

        if (!notification.imageUrl) notification.imageUrl = BUSINESS_IMAGE_URI;
        break;
    }

    notification.text = notificationText;

    return notification;
  }

  private linkify(text: string): string {
    return linker.link(text, {
      email: false,
      phone: false,
      stripPrefix: false,
    });
  }
}
