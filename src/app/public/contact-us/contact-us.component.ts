import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/primeng';

import { FormErrors } from '../../core/shared/form-errors';
import { AppValidators } from '../../core/shared/app-validators';
import { ContactUsSubject } from '../shared/contact-us-subject';
import { PublicService } from '../public.service';

@Component({
  templateUrl: './contact-us.component.html',
  styleUrls: ['../public.scss'],
})
export class ContactUsComponent implements OnInit {
  contactUsForm: FormGroup;
  formErrors: FormErrors;
  subjects: SelectItem[];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private publicService: PublicService,
  ) {
    this.subjects = [
      { label: 'Support', value: ContactUsSubject.Support },
      { label: 'Business account', value: ContactUsSubject.Business },
      { label: 'Other', value: ContactUsSubject.Other },
    ];
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    this.contactUsForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, AppValidators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      recaptchaResponse: ['', Validators.required],
    });

    this.formErrors = new FormErrors(this.contactUsForm);
  }

  onSubmit() {
    this.formErrors.setSubmitted();

    if (this.contactUsForm.valid && this.contactUsForm.dirty) {
      this.publicService.contactSupport(this.contactUsForm.value).subscribe(
        () => {
          this.contactUsForm.reset();
          this.formErrors.reset();

          this.router.navigate(['/message-sent']);
        },
        (response: HttpErrorResponse) => {
          if (response.status === 400) {
            this.toastr.error(response.error.message);
          }
        },
      );
    }
  }
}
