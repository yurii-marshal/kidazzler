import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormErrors } from '../../core/shared/form-errors';
import { Deal } from '../../core/shared/deal.model';
import { BusinessService } from '../../core/business.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'kz-edit-deal',
  templateUrl: './edit-deal.component.html',
  styleUrls: ['./edit-deal.component.scss', '../business-user.scss'],
})
export class EditDealComponent implements OnInit {
  form: FormGroup;
  formErrors: FormErrors;
  isDealImageLoaded: boolean = false;
  isLoading = false;

  @Input() businessId: number;

  constructor(
    private businessService: BusinessService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.buildForm();
    this.form.get('isFreeDeal').valueChanges.subscribe(v => {
      if (v) {
        this.form.get('discount').setValue(100);
      }
      if (!v) {
        this.form.get('discount').setValue('');
      }
    });
  }

  buildForm(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(80)]),
      discount: new FormControl('', [Validators.required]),
      isFreeDeal: new FormControl(false),
      details: new FormControl('', [Validators.required, Validators.maxLength(4000)]),
      expireAt: new FormControl(null, [Validators.required]),
      mediaUrl: new FormControl(null, [Validators.required]),
      code: new FormControl(null, [Validators.maxLength(80)]),
    });

    this.formErrors = new FormErrors(this.form);
  }

  async onSubmit({ value, valid }: { value: Deal; valid: boolean }) {
    this.formErrors.setSubmitted();

    if (!valid) return;
    const dataToSend: Deal = {
      ...value,
      businessId: this.businessId,
    };
    // await this.businessService.addDeal(dataToSend);
    this.toastr.success('Deal was added');
    this.router.navigate(['/']);
  }

  uploadPicture(event) {
    const pictureInput = event.target;

    if (!pictureInput.files || !pictureInput.files[0]) {
      return;
    }
    const picture: File = pictureInput.files[0];

    this.businessService.uploadDealImage(picture).subscribe(
      ({ fileUrl }) => {
        this.form.get('mediaUrl').setValue(fileUrl);
        pictureInput.value = '';
        this.isDealImageLoaded = true;
      },
      error => {
        let message = 'Error uploading picture';
        if (error instanceof HttpErrorResponse) {
          message = error.error.message;
        }
        pictureInput.value = '';
        this.toastr.error(message);
      },
    );
  }

  // get picturePlaceholder(): string {
  //   return this.businessTypeService.PICTURE_PLACEHOLDER_URI;
  // }
}
