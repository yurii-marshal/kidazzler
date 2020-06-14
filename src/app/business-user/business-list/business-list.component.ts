import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { BusinessService } from '../../core/business.service';
import { Business } from '../../core/shared/business.model';
import { PaginatedData } from '../../core/shared/paginated-data';
import { PhoneInfo } from '../../core/shared/phone-info';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'kz-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.scss', '../business-user.scss'],
})
export class BusinessListComponent implements OnInit {
  businesses: PaginatedData<Business>;
  pagination = new BehaviorSubject<{ first: number; rows: number }>({ first: 0, rows: 30 });
  phoneInfo$: Observable<PhoneInfo>;

  constructor(
    private router: Router,
    private businessService: BusinessService,
    private userService: UserService,
    private spinner: NgxUiLoaderService,
  ) {}

  ngOnInit() {
    // if should claim business - redirect
    // const businessId = localStorage.getItem('business-id');
    // if (businessId) {
    //   this.router.navigate(['claim', businessId]);
    // }
    // const isClaiming = !!localStorage.getItem('business-claiming-token');
    // if (isClaiming) {
    //   this.router.navigate(['/claim/-1']);
    // }

    this.phoneInfo$ = this.userService
      .getProfile()
      .pipe(map(profile => ({ code: profile.phoneCode, mask: profile.phoneMask })));
    this.spinner.start();
    this.pagination
      .pipe(
        switchMap((event: any) =>
          this.businessService.getBusinesses({
            offset: event.first,
            limit: event.rows,
          }),
        ),
      )
      .subscribe(
        data => {
          this.businesses = data;
          this.spinner.stop();
        },
        () => {
          this.spinner.stop();
        },
      );
  }

  onPagination(event) {
    this.pagination.next(event);
  }

  addBusiness() {
    this.router.navigate(['businesses/add']);
  }
}
