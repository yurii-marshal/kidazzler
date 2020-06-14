import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AccountService } from '../../../core/account.service';
import { PaginatedData } from '../../../core/shared/paginated-data';

@Component({
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss', '../../parent.scss'],
})
export class ReferralsComponent implements OnInit {
  referrals: PaginatedData<any>;
  pagination = new BehaviorSubject<{ first: number; rows: number }>({ first: 0, rows: 30 });

  constructor(private accountService: AccountService, private spinner: NgxUiLoaderService) {
  }

  ngOnInit() {
    this.spinner.startLoader('loadReferrals');
    this.pagination
      .pipe(
        switchMap((event: any) =>
          this.accountService.getFriends({
            offset: event.first,
            limit: event.rows,
          }),
        ),
      )
      .subscribe(data => {
        this.referrals = data;
        this.spinner.stopLoader('loadReferrals');
      }, () => {
        this.spinner.stopLoader('loadReferrals');
      });
  }

  onPagination(event) {
    this.pagination.next(event);
  }
}
