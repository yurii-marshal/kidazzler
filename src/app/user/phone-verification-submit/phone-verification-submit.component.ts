import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../../core/account.service';
import { UserService } from '../../core/user.service';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';

@Component({
  selector: 'kz-phone-verification-submit',
  templateUrl: './phone-verification-submit.component.html',
  styleUrls: ['./phone-verification-submit.component.scss', '../user.scss'],
})
export class PhoneVerificationSubmitComponent implements OnInit, OnDestroy {
  @ViewChild('firstInput') firstInput: ElementRef;
  @ViewChild('secondInput') secondInput: ElementRef;
  @ViewChild('thirsdInput') thirsdInput: ElementRef;
  @ViewChild('fourthInput') fourthInput: ElementRef;

  code: string = '';
  phoneNumber$: Observable<string>;
  phonePattern: any;
  errorMessage: string;
  timeLeft: number = 60;
  subscribeTimer;
  time: string;

  constructor(private spinner: NgxUiLoaderService, private userService: UserService, private accountService: AccountService, private toast: ToastrService, private router: Router) {
  }

  ngOnInit() {
    this.spinner.start();
    this.phoneNumber$ = this.userService
      .getProfile()
      .pipe(map(profile => {
        this.spinner.stop();
        this.phonePattern = ({ code: profile.phoneCode, mask: profile.phoneMask });
        return profile.phone;
      }));
    this.observableTimer();
  }

  observableTimer() {
    const source = timer(1000, 1000);
    const subscription = source.pipe(untilComponentDestroyed(this)).subscribe(val => {
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
        subscription.unsubscribe();
      }
    });
  }


  onKey(event: any) {
    const { value } = event.target;
    const nextInput = event.target.getAttribute('data-next');
    const prevInput = event.target.getAttribute('data-prev');

    if (value && nextInput) {
      this[nextInput].nativeElement.focus();
      this.code = this.code + value;
      return;
    }

    if (value && !nextInput) {
      this.code = this.code + value;
      return;
    }

    if (!value && !prevInput) {
      this.code = this.code.slice(0, -1);
      return;
    }

    if (!value && prevInput) {
      this.code = this.code.slice(0, -1);
      this[prevInput].nativeElement.focus();
      return;
    }
  }

  resendCode() {
    this.accountService.sendVerifyPhoneCode().subscribe(() => {
      this.observableTimer();
    }, err => {
      this.toast.error(err.error.message || err.message);
    });
  }

  submit() {
    if (this.code.length !== 4) {
      return;
    }
    this.spinner.startLoader('submit-verification');

    this.accountService.verifyPhoneNumber(this.code).subscribe(() => {
      this.spinner.stopLoader('submit-verification');
      this.router.navigate(['']);
    }, (err) => {
      this.spinner.stopLoader('submit-verification');

      this.errorMessage = 'The code is incorrect. Please try again or contact us.';
    });
  }

  ngOnDestroy(): void {
  }
}
