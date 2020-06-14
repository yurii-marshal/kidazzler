import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from './api.service';

@Injectable()
export class BadgesService {
  constructor(private api: ApiService) {
  }

  getBadges(params?): Observable<any> {
    return this.api.get('badges', { params });
  }
}
