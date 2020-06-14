import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BusinessService } from '../../core/business.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppValidators } from '../../core/shared/app-validators';

@Component({
  selector: 'kz-check-your-email',
  templateUrl: './check-your-email.component.html',
  styleUrls: ['./check-your-email.component.scss', '../business-user.scss'],
})
export class CheckYourEmailComponent implements OnInit {
  form: FormGroup;
  businessId: number;
  isFormSubmitted: boolean;

  constructor(
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private toast: ToastrService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.businessId = +this.route.snapshot.queryParams['id'];

    // this.form = this.fb.group({
    //   email: ['', AppValidators.email, Validators.required],
    // });
  }

  // sendEmail() {
  //   if (this.form.valid) {
  //     this.businessService.sendClaimingEmail({
  //       id: this.businessId,
  //       email: this.form.value.email,
  //     }).pipe()
  //       .subscribe(() => {
  //         this.isFormSubmitted = true;
  //         this.toast.success('The verification email was sent');
  //       });
  //   }
  // }

  resendEmail() {
    this.businessService.sendClaimingEmail(this.businessId)
      .subscribe(() => {
        this.toast.success('The verification code was sent again');
      }, (error) => {
        this.toast.error(error);
      });
  }

}
