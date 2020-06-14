import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AccountService } from '../../../core/account.service';

@Component({
  selector: 'kz-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss', '../../parent.scss'],
})
export class PointsComponent implements OnInit {
  isPointsMessageOpen = true;
  timeOptions = [{ label: 'Lifetime', value: 'Lifetime' },
    { label: 'Monthly', value: 'Monthly' }];
  time = 'Lifetime';
  points: any;
  showInvitePopup: boolean = false;

  constructor(private accountService: AccountService, private spinner: NgxUiLoaderService) {
  }

  ngOnInit() {
    this.spinner.startLoader('loadPoints');
    this.accountService.getPointsInfo().subscribe((response) => {
      this.points = response;
      this.spinner.stopLoader('loadPoints');
    }, () => {
      this.spinner.stopLoader('loadPoints');
    });
  }


}
