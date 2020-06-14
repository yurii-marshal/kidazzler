import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BusinessService } from '../../core/business.service';
import { SessionService } from '../../core/session.service';
import { UserService } from '../../core/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'kz-upgrade-business',
  templateUrl: './upgrade-business.component.html',
  styleUrls: ['./upgrade-business.component.scss'],
})

export class UpgradeBusinessComponent implements OnInit {
  businessId: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private sessionService: SessionService,
    private toastr: ToastrService,
    private userService: UserService,
    private spinner: NgxUiLoaderService,
  ) {
  }

  ngOnInit() {
    this.businessId = this.route.snapshot.params['id'];
  }

  upgradeBusiness() {
    this.router.navigate(['business', this.businessId, 'pricing']);
  }

}
