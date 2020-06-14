import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { SignupService } from '../../core/signup.service';

@Component({
  templateUrl: './index-page.component.html',
  styleUrls: ['../parent.scss']
})
export class IndexPageComponent implements OnInit {
  invitationCode: string;

  constructor(
    private router: Router,
    private singupService: SignupService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.invitationCode = this.singupService.getInvitationCode();
  }

  redirectToSignup() {
    if (this.invitationCode) {
      this.router.navigate(['sign-up', this.invitationCode]);
    } else {
      this.toastr.error('Sorry, the invitation code you entered is not valid');
    }
  }
}
