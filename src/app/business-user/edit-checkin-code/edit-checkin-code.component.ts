import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BusinessService } from '../../core/business.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Business } from '../../core/shared/business.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'kz-edit-checkin-code',
  templateUrl: './edit-checkin-code.component.html',
  styleUrls: ['./../checkin-code/checkin-code.component.scss', '../business-user.scss'],
})
export class EditCheckinCodeComponent implements OnInit, OnDestroy {
  editCodeForm: FormGroup;

  @Input() businessId: string;
  @Input() code: string;
  @Input() createdAt: string;
  @Input() count: number;
  @Input() isMobile: boolean;

  @Output() closeEditCode = new EventEmitter();

  isInputFocused = false;

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private spinner: NgxUiLoaderService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.editCodeForm = this.formBuilder.group({
      editedCode: [
        '',
        [Validators.required, Validators.maxLength(8), Validators.pattern(/^[0-9A-Za-z-]+$/)],
      ],
    });
  }

  restrictInput(ev) {
    const code = this.editCodeForm.controls['editedCode'].value;

    if (ev.which === 8 || ev.which === 0 || code.length > 8) {
      return code;
    }

    return this.editCodeForm.controls['editedCode'].setValue(code + ev.key);
  }

  saveCode() {
    if (this.editCodeForm.valid) {
      const editCode = this.editCodeForm.controls['editedCode'].value;
      this.spinner.startLoader('edit-checking-code' + this.businessId);
      this.businessService
        .updateBusiness(Number(this.businessId), { checkInCode: editCode } as Business)
        .subscribe(() => {
          this.code = editCode.slice();

          const codeObj = {
            code: this.code,
            count: this.count,
            createdAt: this.createdAt,
          };

          this.closeEditCode.emit(codeObj);

          this.spinner.stopLoader('edit-checking-code' + this.businessId);

          if (this.isMobile) {
            this.router.navigate([
              'businesses',
              this.businessId,
              'checkin-code',
              codeObj,
            ]);
          }
        });
    }
  }

  close() {
    this.closeEditCode.emit({});
  }

  ngOnDestroy() {
  }
}
