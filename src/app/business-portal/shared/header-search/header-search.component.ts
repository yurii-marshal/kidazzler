import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import { BusinessType } from '../../../core/shared/business-type.model';
import { ShortenStatePipe } from '../../../shared/shorten-state.pipe';

@Component({
  selector: 'kz-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss'],
  providers: [ShortenStatePipe],
})
export class HeaderSearchComponent implements OnInit, OnChanges {
  @Input() category: BusinessType;
  @Input() query: string;
  @Input() resultLocation: string;
  @Input() currentLocation: string;
  @Input() isInput: boolean = false;
  @Input() onlyLocation: boolean = false;
  @Input() onlySearch: boolean = false;
  @Input() placeHolder: string;
  @Input() customGoBack: boolean = false;
  @Output() onSearch = new EventEmitter();
  @Output() onLocation = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  @Output() onBack = new EventEmitter();
  isSearchFocused = false;
  urlParams: {
    category?: number;
    currentLocation?: string;
  } = {};
  locationSearch: string;
  locationSearch$ = new Subject();
  search: string;
  search$ = new Subject();
  locationPlaceholder: string;
  locationParams: string;

  constructor(private location: Location, private router: Router, private shortenStatePipe: ShortenStatePipe) {
    this.locationSearch$.pipe(debounceTime(1000))
      .subscribe(val => this.onLocation.emit(val));
    this.search$.pipe(debounceTime(1000))
      .subscribe(val => this.onSearch.emit(val));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category'] && changes['category'].currentValue) {
      this.category = changes['category'].currentValue;
      this.search = this.category.code;
    }
    if (changes['currentLocation'] && changes['currentLocation'].currentValue) {
      this.locationSearch = changes['currentLocation'].currentValue.split(', ').slice(0, -1).join(', ');
    }

    if (changes['resultLocation'] && changes['resultLocation'].currentValue) {
      this.locationParams = changes['resultLocation'].currentValue;
      this.locationPlaceholder = changes['resultLocation'].currentValue.split(', ')
        .map((el, i) => i === 0 ? el : this.shortenStatePipe.transform(el)).slice(0, -1).join(', ');
    }
  }

  ngOnInit() {
  }

  searchSubmit(): void {
    this.onSubmit.emit();
  }

  onLocationChange(event: string): void {
    this.locationSearch$.next(event);
  }

  onSearchChange(event: string): void {
    this.search$.next(event);
  }

  goToSearch() {
    if (this.category) {
      this.urlParams.category = this.category.id;

    }
    this.urlParams.currentLocation = this.locationParams;
    this.router.navigate(['/business-portal/search'], {
      queryParams: { ...this.urlParams },
    });
  }

  goBack() {
    this.customGoBack ? this.onBack.emit() : this.location.back();
  }
}
