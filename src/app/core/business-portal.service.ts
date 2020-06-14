import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { BusinessType } from './shared/business-type.model';
import { Business } from './shared/business.model';

@Injectable({
  providedIn: 'root',
})
export class BusinessPortalService implements OnDestroy {
  public headerSearch$ = new EventEmitter();

  constructor(private api: ApiService, private http: HttpClient) {
  }

  ngOnDestroy() {
    this.headerSearch$.unsubscribe();
  }

  getSliderImages(): Observable<any> {
    return this.api.get(`slides`);
  }

  getCategory(id: number): Observable<any> {
    return this.api.get(`business-types/${id}`);
  }

  getCategories(params?): Observable<any> {
    return this.api.get(`business-types`, { params: params });
  }

  getBestCategories(params): Observable<any> {
    return this.api.get(`businesses/best`, { params: params }).pipe(
      map(({ items }) => {
        return {
          items: items.sort((a, b) => a.code > b.code ? 1 : -1).map(category => {
            category.businesses.map((business) => {
              business.businessTypes.sort((a, b) => a.code > b.code ? 1 : -1);
              return business;
            });
            return category;
          }),
        };
      }),
    );
  }

  getBusinesses(params): Observable<any> {
    if (Array.isArray(params.amenities)) {
      params.amenities = params.amenities.join(',');
    }
    return this.api.get('businesses', { params: params }).pipe(
      map((obj: any) => {
        return {
          count: obj.count,
          offset: obj.offset,
          limit: obj.limit,
          items: obj.items.map((business) => {
            business.businessTypes.sort((a, b) => a.code > b.code ? 1 : -1);
            return business;
          }),
        };
      }),
    );
  }

  getRelatedBusinesses(id: number, params?: {}): Observable<{ items: Business[] }> {
    return this.api.get(`/businesses/${id}/related`, { params: params });
  }

  searchByAllEntities(params) {
    params['limit'] = 5;

    return combineLatest(
      this.getBusinesses(params),
      this.getCategories(params),
    );
  }

  getLocation(query: string, params?): Observable<any> {
    if (query.length > 0) {
      return this.http.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${environment.mapBoxAccessToken}`,
        { params: params },
      );
    } else {
      const response = { features: [] };
      return of(response);
    }
  }

  getLocationsInArea(
    query = '*',
    proximity = { lat: -122.259, lng: 37.872 },
    bbox = { a: { lat: -122.30937, lng: 37.84214 }, b: { lat: -122.23715, lng: 37.89838 } },
    limit = 5,
    params?,
  ): Observable<any> {
    if (query.length) {
      return this.http.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json
        ?access_token=${environment.mapBoxAccessToken}
        &proximity=${proximity.lat},${proximity.lng}
        &bbox=${bbox.a.lat},${bbox.a.lng},${bbox.b.lat},${bbox.b.lng}
        &limit=${limit}`,
        { params: params },
      );
    }
  }
}
