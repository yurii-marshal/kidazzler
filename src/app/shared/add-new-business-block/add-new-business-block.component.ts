import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from '../../core/business.service';
import { UserService } from '../../core/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'kz-add-new-business-block',
  templateUrl: './add-new-business-block.component.html',
  styleUrls: ['./add-new-business-block.component.scss'],
})
export class AddNewBusinessBlockComponent implements OnInit {
  currentAddNewBackground: string;
  verifyEmailForm: FormGroup;
  isShowPopup: boolean;

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private userService: UserService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    const addNewBlockBackgrounds = ['#4abbb5', '#4b03bd', '#bd10e0'];
    this.currentAddNewBackground = addNewBlockBackgrounds[Math.floor(Math.random() * 3)];
  }

  buildForm() {
    this.verifyEmailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    this.businessService.sendClaimingEmail(1).pipe()
      .subscribe(() => {

      });
  }

  goToCreateBusiness() {
    /*for mobile redirect to adding new business*/
    this.userService.isMobile() ? window.location.href = this.userService.getMobileUrl('/download-app?action=add_missing_place') : this.router.navigate(['add-business']);
  }

}
