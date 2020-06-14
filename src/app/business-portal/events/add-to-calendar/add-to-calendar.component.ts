import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BusinessService } from '../../../core/business.service';

@Component({
  selector: 'kz-add-to-calendar',
  templateUrl: './add-to-calendar.component.html',
  styleUrls: ['./add-to-calendar.component.scss'],
})
export class AddToCalendarComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private spinner: NgxUiLoaderService, private businessService: BusinessService, private toast: ToastrService) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }
}
