import { Injectable } from '@angular/core';

import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap, flatMap } from 'rxjs/operators';
import { CheckIn } from '../business-portal/check-in/shared/check-in';

import { ApiOptions, ApiService } from './api.service';
import { BusinessEvent } from './shared/business-event';
import { BusinessType } from './shared/business-type.model';
import { Business } from './shared/business.model';
import { PhoneInfo } from './shared/phone-info';
import { PaginatedData } from './shared/paginated-data';
import { PaginatedDataParams } from './shared/paginated-data-params';
import { GoogleAnalyticsEvent, GoogleAnalyticsService } from './analytics/google-analytics.service';
import { UserService } from './user.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { BusinessDirection } from './shared/enums/business-direction.enum';
import { Deal } from './shared/deal.model';
import { BusinessPhoto } from './shared/business-photo.model';
import { WorkingHours } from './shared/working-hours';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class BusinessService {
  private weekdays = [
    {
      name: 'Monday', value: false,
      hours: {
        startAt: null as any,
        endAt: null as any,
      },
      isOpenover: false,
    },
    {
      name: 'Tuesday', value: false,
      hours: {
        startAt: null as any,
        endAt: null as any,
      },
      isOpenover: false,
    },
    {
      name: 'Wednesday', value: false,
      hours: {
        startAt: null as any,
        endAt: null as any,
      },
      isOpenover: false,
    },
    {
      name: 'Thursday', value: false,
      hours: {
        startAt: null as any,
        endAt: null as any,
      },
      isOpenover: false,
    },
    {
      name: 'Friday', value: false,
      hours: {
        startAt: null as any,
        endAt: null as any,
      },
      isOpenover: false,
    },
    {
      name: 'Saturday', value: false,
      hours: {
        startAt: null as any,
        endAt: null as any,
      },
      isOpenover: false,
    },
    {
      name: 'Sunday', value: false,
      hours: {
        startAt: null as any,
        endAt: null as any,
      },
      isOpenover: false,
    },
  ];
  private workingHours = {
    mondayStart: '',
    mondayEnd: '',
    tuesdayStart: '',
    tuesdayEnd: '',
    wednesdayStart: '',
    wednesdayEnd: '',
    thursdayStart: '',
    thursdayEnd: '',
    fridayStart: '',
    fridayEnd: '',
    saturdayStart: '',
    saturdayEnd: '',
    sundayStart: '',
    sundayEnd: '',
  };

  constructor(
    private api: ApiService,
    private analyticsService: GoogleAnalyticsService,
    private userService: UserService,
    private http: HttpClient,
    private toastr: ToastrService,
  ) {
  }

  createBusiness(businessCreateData: any): Observable<Business> {
    businessCreateData = this.prepareBusinessType(businessCreateData);

    return this.userService.getProfileSnapshot().pipe(
      switchMap(profile => {
        return this.api.post<any>('businesses', businessCreateData).pipe(
          catchError(error => {
            // todo: http error common handler/transformer
            if (error instanceof HttpErrorResponse) {
              const requestError = error.error || {};

              if (requestError.errorType === 'PhoneNumberInUseError') {
                this.analyticsService.track(GoogleAnalyticsEvent.BusinessPhoneNumberInUse, {
                  event_label: `Business phone number in use (user id: ${profile.id})`,
                });
              }
            }

            throw error;
          }),
          map(data => {
            this.userService.updateProfileInfo({ businessesCount: profile.businessesCount + 1 });

            return this.parseBusinessType(data);
          }),
        );
      }),
    );
  }

  searchTypes(query?: string, params?: object): Observable<BusinessType[]> {
    const options: ApiOptions = {};

    if (query) {
      options.params = { query };

      if (params) {
        options.params = Object.assign(options.params, params);
      }
    } else {
      return of([]);
    }

    return this.api.get('business-types', options);
  }

  updateBusiness(businessId: number, data: Partial<Business>): Observable<null> {
    data = this.mapDataForUpdate(data);
    return this.api.put<null>(`businesses/${businessId}`, data);
  }

  getUnclaimedBusiness(token: string): Observable<Business> {
    return this.api
      .get<any>('businesses/unclaimed', { params: { token } })
      .pipe(flatMap(data => of(this.parseBusinessType(data))));
  }

  getBusinesses(params?: PaginatedDataParams): Observable<PaginatedData<Business>> {
    return this.api
      .get<PaginatedData<any>>('accounts/me/businesses', {
        params: ApiService.normalizePaginatedDataParams(params),
      })
      .pipe(
        map(data => {
          data.items = data.items.map(businessData => this.parseBusinessType(businessData));

          this.userService.updateProfileInfo({ businessesCount: data.count });

          return data;
        }),
      );
  }

  getBusinessPhotos(id: number, params?): Observable<{ items: BusinessPhoto[] }> {
    return this.api.get<{ items: BusinessPhoto[] }>(`businesses/${id}/photos`, { params: params });
  }

  getEventCategories(): Observable<any> {
    return this.api.get('event-categories');
  }

  uploadBusinessPhoto(businessId: number, photos, params?): Observable<any> {
    return this.api.post(`businesses/${businessId}/photos`, photos, { params: params });
  }

  uploadBusinessPicture(image: File): Observable<string> {
    return this.api
      .get<{ fileUrl: string; uploadUrl: string }>('storage/upload-url', {
        params: {
          type: 'business_picture',
          contentType: image.type,
        },
      })
      .pipe(
        switchMap(({ fileUrl, uploadUrl }) => {
          return this.http
            .put(uploadUrl, image, {
              headers: {
                'Content-Type': image.type,
              },
            })
            .pipe(map(r => fileUrl));
        }),
      );
  }

  // uploadBusinessPicture(imageList: File[] = []): Observable<string[]> {
  //   const images = Array.from(imageList);
  //   const observables: Array<Observable<string>> = [];
  //
  //   images.forEach((image) => {
  //       observables.push(this.api
  //         .get<{ fileUrl: string; uploadUrl: string }>('storage/upload-url', {
  //           params: { type: 'business_picture', contentType: image.type },
  //         })
  //         .pipe(
  //           switchMap(({ fileUrl, uploadUrl }) => {
  //             return this.http
  //               .put(uploadUrl, image, {
  //                 headers: {
  //                   'Content-Type': image.type,
  //                 },
  //               })
  //               .pipe(map(r => fileUrl));
  //           }),
  //         ),
  //       );
  //     },
  //   );
  //
  //   return forkJoin(observables);
  // }

  // async uploadBusinessPicture(image: File) {
  //   const { fileUrl, uploadUrl } = await this.api
  //     .get<{ fileUrl: string; uploadUrl: string }>('storage/upload-url', {
  //       params: { type: 'business_picture', contentType: image.type },
  //     })
  //     .toPromise();
  //
  //   this.http
  //     .put(uploadUrl, image, {
  //       headers: {
  //         'Content-Type': image.type,
  //       },
  //     })
  //     .toPromise();
  //
  //   return fileUrl;
  // }

  getAmenities(params?): Observable<any> {
    return this.api.get('amenities', { params: params });
  }

  getDealPhotos(businessId: number, dealId: number, params?): Observable<any> {
    return this.api.get(`businesses/${businessId}/deals/${dealId}/photos`, { params: params });
  }

  getEventPhotos(businessId: number, eventId: number, params?): Observable<any> {
    return this.api.get(`businesses/${businessId}/events/${eventId}/photos`, { params: params });
  }

  uploadDealPhoto(businessId: number, dealId: number, body): Observable<any> {
    return this.api.post(`businesses/${businessId}/deals/${dealId}/photos`, body);
  }

  uploadEventPhoto(businessId: number, eventId: number, body): Observable<any> {
    return this.api.post(`businesses/${businessId}/events/${eventId}/photos`, body);
  }

  deleteDealPhoto(businessId: number, dealId: number, photoId: number): Observable<any> {
    return this.api.delete(`businesses/${businessId}/deals/${dealId}/photos/${photoId}`);
  }

  deleteEventPhoto(businessId: number, eventId: number, photoId: number): Observable<any> {
    return this.api.delete(`businesses/${businessId}/events/${eventId}/photos/${photoId}`);
  }

  deleteBusinessPhoto(businessId: number, photoId: number): Observable<any> {
    return this.api.delete(`businesses/${businessId}/photos/${photoId}`);
  }

  deleteDeal(businessId: number, dealId: number): Observable<any> {
    return this.api.delete(`businesses/${businessId}/deals/${dealId}`);
  }

  deleteEvent(businessId: number, eventId: number): Observable<any> {
    return this.api.delete(`businesses/${businessId}/events/${eventId}`);
  }

  makePrimaryDealsPhoto(id: number, dealId: number, body): Observable<any> {
    return this.api.put(`businesses/${id}/deals/${dealId}`, body);
  }

  makePrimaryEventsPhoto(id: number, eventId: number, body): Observable<any> {
    return this.api.put(`businesses/${id}/events/${eventId}`, body);
  }

  makePrimaryPhoto(id: number, body): Observable<any> {
    return this.api.put(`businesses/${id}`, body);
  }

  claimBusiness(id: number): Promise<null> {
    return this.api.put<null>(`businesses/${id}/claim`, null).toPromise();
  }

  sendClaimingEmail(id: number): Observable<any> {
    return this.api.post(`businesses/${id}/send-claiming-email`, {});
  }

  setClaimBusinessVerification(id: number, body): Observable<any> {
    return this.api.post(`businesses/${id}/start-phone-verification`, body);
  }

  sendClaimCode(id: number, body): Observable<any> {
    return this.api.put(`businesses/${id}/claim`, body);
  }

  validatePhone(phoneNumber: number, type: string): Observable<null> {
    return this.userService.getProfileSnapshot().pipe(
      switchMap(profile => {
        return this.api.post<null>('phone-validate', { phone: phoneNumber, type: type }).pipe(
          catchError(error => {
            // todo: http error common handler/transformer
            if (error instanceof HttpErrorResponse) {
              const requestError = error.error || {};

              if (requestError.errorType === 'PhoneNumberInUseError') {
                this.analyticsService.track(GoogleAnalyticsEvent.BusinessPhoneNumberInUse, {
                  event_label: `Business phone number in use (user id: ${profile.id})`,
                });
              }
            }

            throw error;
          }),
        );
      }),
    );
  }

  getPhoneInfo(countryCode: string): Observable<PhoneInfo> {
    return this.api.get(`phone-codes/${countryCode}`).pipe(
      map((data: PhoneInfo) => {
        data.mask = data.mask.replace(/d/g, '9').replace(/[{}]/g, '');
        return data;
      }),
    );
  }

  uploadDealImage(image: File): Observable<any> {
    return this.api
      .get<{ fileUrl: string; uploadUrl: string }>('storage/upload-url', {
        params: { type: 'deal_image', contentType: image.type },
      })
      .pipe(
        switchMap(({ fileUrl, uploadUrl }) => {
          return this.http
            .put(uploadUrl, image, {
              headers: {
                'Content-Type': image.type,
              },
            })
            .pipe(map(r => ({ ...r, fileUrl })));
        }),
      );
  }

  rateBusiness(businessId, rating): Observable<{ rating: number; count: number }> {
    return this.api.put<null>(`businesses/${businessId}/rate`, { rating });
  }

  getEvent(businessId: number, eventId: number): Observable<BusinessEvent> {
    return this.api.get(`businesses/${businessId}/events/${eventId}`);
  }

  addEvent(businessId: number, event: BusinessEvent): Observable<any> {
    return this.api.post(`businesses/${businessId}/events`, event);
  }

  editEvent(businessId: number, eventId: number, event: BusinessEvent): Observable<any> {
    return this.api.put(`businesses/${businessId}/events/${eventId}`, event);
  }

  getEvents(businessId: number, params?): Observable<any> {
    return this.api.get(`businesses/${businessId}/events`, { params: params });
  }

  addDeal(id: number, deal: Deal): Observable<any> {
    return this.api.post(`businesses/${id}/deals`, deal);
  }

  editDeal(id: number, dealId: number, deal: Partial<Deal>): Observable<any> {
    return this.api.put(`businesses/${id}/deals/${dealId}`, deal);
  }

  getDeals(id: number, params?): Observable<any> {
    return this.api.get(`businesses/${id}/deals`, { params: params });
  }

  getDeal(id: number, dealId: number): Observable<any> {
    return this.api.get(`businesses/${id}/deals/${dealId}`);
  }

  getBusinessById(id: number): Observable<Business> {
    return this.api.get<any>(`businesses/${id}`).pipe(
      map((business: Business) => {
        business.businessTypes.sort((a, b) => a.code > b.code ? 1 : -1);
        return business;
      }),
    );
  }

  checkIn(businessId: number | string, data: CheckIn): Observable<any> {
    return this.api.post(`businesses/${businessId}/check-in`, data);
  }

  generateCheckinCode(length) {
    return Array.apply(0, Array(length))
      .map(function() {
        return (function(charset) {
          return charset.charAt(Math.floor(Math.random() * charset.length));
        })('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
      })
      .join('');
  }

  getWeekdaysArray(hoursArr: any[], startFrom: string) {
    const week = this.weekdays.map(o => ({ ...o }));
    for (let i = 0; i < hoursArr.length; i += 2) {
      if (hoursArr[i] || hoursArr[i + 1]) {
        week[i / 2].hours.startAt = new Date(new Date().setHours(Number(hoursArr[i].slice(0, 2)), 0));
        week[i / 2].hours.endAt = new Date(new Date().setHours(Number(hoursArr[i + 1].slice(0, 2)), 0));
        week[i / 2].value = true;
        if (week[i / 2].hours.startAt.getHours() === 0 && week[i / 2].hours.endAt.getHours() === 23) {
          week[i / 2].isOpenover = true;
        }
      }
    }

    if (startFrom === 'SU') {
      const temp = week[week.length - 1];
      week.pop();
      week.unshift(temp);
    }

    return week;
  }

  getWeekdaysObj(hoursArr, startFrom: string): WorkingHours {
    const workingHoursObj = Object.assign({}, this.workingHours);

    if (startFrom === 'SU') {
      const temp = hoursArr[0];
      hoursArr.shift();
      hoursArr.push(temp);
    }

    Object.keys(workingHoursObj).forEach((key, i) => {
      let start: any = hoursArr[Math.floor(i / 2)].hours.startAt;
      let end: any = hoursArr[Math.floor(i / 2)].hours.endAt;

      if (!start || !end || start > end) {
        start = null;
        end = null;
      }

      // if (start > end) {
      //   const _end = end;
      //   end = start;
      //   start = _end;
      // }

      if (i % 2 === 0) {
        workingHoursObj[key] = start instanceof Date ?
          ('0' + start.getHours()).slice(-2) + ':' +
          ('0' + start.getMinutes()).slice(-2) : start;
      }

      if (i % 2 !== 0) {
        workingHoursObj[key] = end instanceof Date ?
          ('0' + end.getHours()).slice(-2) + ':' +
          ('0' + end.getMinutes()).slice(-2) : end;
      }
    });

    return workingHoursObj;
  }

  isOpen(workingHours) {
    const date = new Date();
    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()];
    const minutesPassed = date.getHours() * 60 + date.getMinutes();
    const start = this.getMinutes(workingHours[`${dayName}Start`]);
    const end = this.getMinutes(workingHours[`${dayName}End`]);
    const startDate = start === 0 ? new Date(date.setHours(0, 0, 0, 0)) : new Date(date.setMinutes(start));
    if (start === null || end === null) {
      return { opened: null as any, start: null as any, end: null };
    }
    return {
      opened: minutesPassed >= start && minutesPassed <= end,
      start: workingHours[`${dayName}Start`],
      end: workingHours[`${dayName}End`],
    };
  }

  copyToClipboart(text: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastr.success('Link was successfully copied');
  }

  private getMinutes(timeString: string) {
    if (!timeString) {
      return null;
    }
    const timeArr = timeString.split(':');
    return parseInt(timeArr[0], 10) * 60 + parseInt(timeArr[1], 10);
  }

  private mapMobileData(data: Partial<Business>) {
    const mobileData = {
      id: data.id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      website: data.website,
      businessDirection: data.businessDirection,
      isClaimed: data.isClaimed,
      closed: data.closed,
    };
    return mobileData;
  }

  private mapDataForUpdate(data: Partial<Business>): Partial<Business> {
    let mappedData = {
      ...this.prepareBusinessType(data),
    };
    if (data.businessDirection && data.businessDirection === BusinessDirection.Mobile) {
      mappedData = {
        ...mappedData,
        ...this.mapMobileData(data),
      };
    }
    return mappedData;
  }

  private prepareBusinessType(data: any): any {
    if (!data.businessType) {
      return data;
    }

    if (data.businessType.id) {
      data.businessTypeId = data.businessType.id;
      delete data.businessType;
    } else {
      data.businessType = data.businessType.code;
    }

    return data;
  }

  private parseBusinessType(data: any): Business {
    // todo: wtf is this?
    // data.businessType = {
    //   id: data.businessTypeId,
    //   code: data.businessType,
    //   description: data.businessType,
    // };
    // delete data.businessTypeId;

    return data;
  }
}
