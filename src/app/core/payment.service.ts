import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  constructor(private api: ApiService) {
  }

  pay(payment): Observable<any> {
    return this.api.post(`payment`, payment);
  }
}
