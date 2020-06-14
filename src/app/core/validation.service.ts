import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BusinessService } from './business.service';

@Injectable()
export class ValidationService {
  constructor(private businessService: BusinessService) {}

  validatePhone(control: AbstractControl, type: string) {
    if (!control.dirty || control.value === '') {
      return of(null);
    }

    return this.businessService.validatePhone(control.value, type).pipe(
      map(() => null),
      catchError(error => {
        // todo: http error common handler/transformer
        if (error instanceof HttpErrorResponse) {
          const requestError = error.error || {};

          if (requestError.errorType === 'PhoneNumberInUseError') {
            return of({
              invalid:
                'Oops! Looks like this business is already "Locked" in Kidazzler. Try "Locking" another one.',
            });
          } else if (requestError.message) {
            return of({ invalid: requestError.message });
          }
        }
      }),
    );
  }
}

