import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService } from '../../core/business.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from '../../core/user.service';
import { AccountService } from '../../core/account.service';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';
import { PhoneInfo } from '../../core/shared/phone-info';

@Component({
  selector: 'kz-enter-code',
  templateUrl: './enter-code.component.html',
  styleUrls: ['./enter-code.component.scss', '../business-user.scss'],
})
export class EnterCodeComponent implements OnInit, OnDestroy {
  @ViewChild('firstInput') firstInput: ElementRef;
  @ViewChild('secondInput') secondInput: ElementRef;
  @ViewChild('thirdInput') thirdInput: ElementRef;
  @ViewChild('fourthInput') fourthInput: ElementRef;

  businessId: number;
  code: string[] = ['', '', '', ''];
  phoneInfo$: Observable<PhoneInfo>;
  errorMessage: string;
  timeLeft = 60;
  subscribeTimer;
  time: string;
  businessPhone = '';
  isCodeComplete: boolean;
  claimingToken: string;

  isMobile: boolean;
  isCodeSent = true;
  isTimerOut: boolean;

  constructor(
    private spinner: NgxUiLoaderService,
    private userService: UserService,
    private businessService: BusinessService,
    private accountService: AccountService,
    private toast: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.spinner.startLoader('submit-verification');
    this.businessId = this.activatedRoute.snapshot.params['id'];

    this.claimingToken = localStorage.getItem('business-claiming-token');
    this.businessPhone = localStorage.getItem('business-phone');

    this.isMobile = this.userService.isMobile();

    this.phoneInfo$ = this.userService
      .getProfile()
      .pipe(map(profile => ({ code: profile.phoneCode, mask: profile.phoneMask })));

    this.isTimerOut = new Date().getTime() > Number(localStorage.getItem('claim-timeout')) + 60000;

    this.observableTimerStart();

    this.spinner.stopLoader('submit-verification');
  }

  observableTimerStart() {
    const source = timer(1000, 1000);

    if (this.isTimerOut) {
      this.timeLeft = 60;
      localStorage.setItem('claim-timeout', (new Date().getTime()).toString());
    } else {
      const timeLast = (Number(localStorage.getItem('claim-timeout')) + 60000) - new Date().getTime();
      this.timeLeft = Number((timeLast / 1000).toFixed(0));

      setTimeout(() => {
        this.toast.warning('Code is sent. Please, enter the code to claim the business.');
      });
    }

    const subscription = source
      .pipe(untilComponentDestroyed(this))
      .subscribe(val => {
        this.subscribeTimer = this.timeLeft - val;

        if (this.subscribeTimer > 59) {
          this.time = '01:00';
        }

        if (this.subscribeTimer < 60) {
          this.time = `00:${this.subscribeTimer}`;
        }

        if (this.subscribeTimer < 10) {
          this.time = `00:0${this.subscribeTimer}`;
        }

        if (this.subscribeTimer === 0) {
          localStorage.removeItem('claim-timeout');
          this.isCodeSent = false;
          this.isTimerOut = true;
          subscription.unsubscribe();
        }
      });
  }

  onKey(event: any, index) {
    const { value } = event.target;
    const nextInput = event.target.getAttribute('data-next');
    const prevInput = event.target.getAttribute('data-prev');

    this.code[index] = value[0];

    this.isCodeComplete = this.code.every(i => !!i === true);

    if (value.length > 1) {
      event.target.value = value[0];
      return;
    }

    // focus on a sibling
    if (!value && prevInput) {
      this[prevInput].nativeElement.focus();
      return;
    }

    if (value && nextInput) {
      this[nextInput].nativeElement.focus();
      return;
    }
  }

  resendCode() {
    this.isCodeSent = true;
    this.businessService.setClaimBusinessVerification(this.businessId, {
      type: 'sms',
    })
      .subscribe(() => {
        this.code = ['', '', '', ''];
        this.firstInput.nativeElement.value = '';
        this.secondInput.nativeElement.value = '';
        this.thirdInput.nativeElement.value = '';
        this.fourthInput.nativeElement.value = '';
        this.isCodeComplete = false;

        this.observableTimerStart();
        this.toast.success('We resent claim code to this business phone number');
      }, (error) => {
        this.toast.error(error.error.message || error.message);
      });
  }

  submit() {
    this.spinner.startLoader('submit-verification');

    this.businessService.sendClaimCode(Number(this.businessId), {
      verificationCode: this.code.join(''),
    })
      .subscribe(() => {
        this.spinner.stopLoader('submit-verification');
        this.toast.success('Business is successfully claimed');

        if (this.claimingToken) {
          localStorage.removeItem('business-claiming-token');
          this.router.navigate(['../business-verified']);
        } else {
          this.router.navigate(['../business-portal']);
        }
      }, (error) => {
        this.spinner.stopLoader('submit-verification');
        this.toast.error('The code is incorrect. Please try again or contact us through the "Contact Us" form in the footer');
      });
  }

  ngOnDestroy(): void {
  }
}
