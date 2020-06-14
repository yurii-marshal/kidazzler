import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BusinessService } from '../../core/business.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Business } from '../../core/shared/business.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'kz-checkin-code',
  templateUrl: './checkin-code.component.html',
  styleUrls: ['./checkin-code.component.scss', '../business-user.scss'],
})
export class CheckinCodeComponent implements OnInit, OnDestroy {
  isEditing: boolean;

  @Input() businessId: string;
  @Input() code: string;
  @Input() createdAt: string;
  @Input() count: number;

  @Input() isMobile = true;

  @Output() checkinCodeClose = new EventEmitter();

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner: NgxUiLoaderService,
  ) {
  }

  ngOnInit() {
    if (this.isMobile) {
      this.businessId = this.route.snapshot.paramMap.get('id');
      this.code = this.route.snapshot.params.code;
      this.count = this.route.snapshot.params.count;
      this.createdAt = this.route.snapshot.params.createdAt;

      if (!this.route.snapshot.params.code) {
        this.businessService.getBusinessById(Number(this.businessId))
          .subscribe((data: Business) => {
            this.code = data.checkInCode;
            this.count = data.checkInsCount;
            this.createdAt = data.checkInCodeGeneratedAt;
          });
      }
    }
  }

  createCode() {
    const randomCode = this.businessService.generateCheckinCode(8);
    this.spinner.startLoader('checking-code');
    this.businessService
      .updateBusiness(Number(this.businessId), { checkInCode: randomCode } as Business)
      .subscribe(() => {
        this.code = randomCode;
        this.createdAt = new Date().getTime().toString();
        this.spinner.stopLoader('checking-code');
      });
  }

  openEditDialog() {
    this.isEditing = true;
    this.checkinCodeClose.emit(true);
  }

  onCloseEditCode(data) {
    if (data.code) {
      this.code = data.code;
    }

    this.isEditing = false;
    this.checkinCodeClose.emit(false);
  }

  onBackCheckinCode() {
    this.router.navigate(['businesses']);
  }

  ngOnDestroy() {
  }
}
