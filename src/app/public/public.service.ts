import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '../core/api.service';
import { ContactUsMessage } from './shared/contact-us-message';

@Injectable()
export class PublicService {
  constructor(private api: ApiService) {}

  contactSupport(data: ContactUsMessage): Observable<null> {
    return this.api.post('contact-us', data);
  }
}
