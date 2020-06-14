import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../core/user.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { UserProfile } from '../../user/shared/user-profile.model';
import { BusinessPortalService } from '../../core/business-portal.service';
import { BusinessType } from '../../core/shared/business-type.model';
import { Router } from '@angular/router';
import { SessionService } from '../../core/session.service';

export interface SearchType {
  type: 'category' | 'common';
  query: string;
  location: string;
  coordinates: number[];
}

@Component({
  selector: 'kz-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
  @Input() customStyle = '';
  @Input() showSuggestions: boolean;

  locationSearchPlaceHolder: string;
  querySearchPlaceholder: string;
  querySearch: string;
  locationSearch: string;
  locationCoordinates: number[];
  locationChanged$: Subject<number[]> = new Subject<number[]>();
  isDesktop: boolean;
  isAuthorized: boolean;

  headerQueryChanges$: Subject<string> = new Subject<string>();

  topCategories: BusinessType[] = [];
  entities: any[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private sessionService: SessionService,
    private businessPortalService: BusinessPortalService,
  ) {
    this.querySearch = '';
    this.locationSearch = '';
    this.locationCoordinates = [];
    this.isAuthorized = this.sessionService.isAuthorized();

    if (this.isAuthorized) {
      this.userService.getProfile()
        .pipe(take(1))
        .subscribe((profile: UserProfile) => {
          this.businessPortalService.getBestCategories({
            state: profile.state,
            city: profile.city,
            country: profile.country,
            limitBusinesses: 8,
            nearby: true,
          }).subscribe(({ items }) => {
            this.topCategories = items;
          });
        });
    }
  }

  ngOnInit() {
    this.isDesktop = !this.userService.isMobile();
    this.querySearchPlaceholder = this.isDesktop ?
      `"Music class, restaurant, museum, party..."` :
      `"Music class, museum, party..."`;

    this.headerQueryChanges$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
      )
      .subscribe((model) => {
        this.querySearch = model;

        this.getEntities();

        this.onSearch();
      });

    this.locationChanged$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
      )
      .subscribe(model => {
        this.locationCoordinates = model;

        this.onSearch();
      });
  }

  ngOnDestroy() {
    this.locationChanged$.unsubscribe();
    this.headerQueryChanges$.unsubscribe();
  }

  onQueryFieldFocus() {
    this.showSuggestions = true;

    if (this.querySearch.length && !this.entities.length) {
      this.getEntities();
    } else {
      this.entities = [];
    }
  }

  getEntities() {
    this.businessPortalService.searchByAllEntities({ query: this.querySearch })
      .subscribe(([{ items }, categories]) => {
        items ? items.forEach(i => i['type'] = 'business') : items = [];
        categories && categories['items'] ?
          categories['items'].forEach(i => i['type'] = 'category') : categories = { items: [] };

        this.entities = [...items, ...categories['items']].slice(0, 5);
      });
  }

  onCategoryChoose(category) {
    this.router.navigate(['/business-portal/category', category.id, 'sub-categories']);
  }

  onEntityChoose(entity) {
    switch (entity.type) {
      case 'business':
        this.router.navigate(['/business-portal/business', entity.id]);
        break;
      case 'category':
        this.router.navigate(['/business-portal/category', entity.id, 'sub-categories']);
        break;
    }
  }

  goToResults() {
    if (this.querySearch || this.locationSearch) {
      this.router.navigate(['/business-portal/search-result'], {
        queryParams: {
          category: '',
          query: this.querySearch,
          location: this.locationSearch,
          coordinatesBox: this.locationCoordinates.join(',') || '',
        },
      });
    }
  }

  onQueryChange(ev) {
    this.headerQueryChanges$.next(ev);
  }

  onLocationChange(ev) {
    // this.onSearch();
  }

  onCoordinatesChange(coords: number[]) {
    this.locationChanged$.next(coords);
    this.goToResults();
  }

  onSearch() {
    const search: SearchType = {
      type: 'category',
      query: this.querySearch,
      location: this.locationSearch,
      coordinates: this.locationCoordinates,
    };

    this.businessPortalService.headerSearch$.next(search);
  }
}
