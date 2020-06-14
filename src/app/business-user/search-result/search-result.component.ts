import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService } from '../../core/business.service';
import { Business } from '../../core/shared/business.model';
import { SearchParams } from '../../core/shared/search-params';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';

@Component({
  selector: 'kz-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss', '../business-user.scss'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  params: any;
  businesses: Business[];
  firstBusinessesPart: Business[];
  secondBusinessesPart: Business[];
  verifyEmailForm: FormGroup;
  businessId: number;

  constructor(private route: ActivatedRoute, private businessService: BusinessService, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams.pipe(untilComponentDestroyed(this)).subscribe((params: SearchParams) => {
      this.params = { ...params };
    });
    this.businessService.getBusinesses(this.params).pipe()
      .subscribe((businesses) => {
        this.businesses = businesses.items;
        if (businesses.items.length > 2) {
          this.firstBusinessesPart = businesses.items.splice(0, 2);
          this.secondBusinessesPart = businesses.items;
        } else {
          this.firstBusinessesPart = businesses.items;
          this.secondBusinessesPart = [];
        }
      });
  }

  claimBusiness(id) {
    this.businessId = id;
    this.buildForm();
  }

  buildForm() {
    this.verifyEmailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    if (this.verifyEmailForm.invalid) {
      return;
    }
    this.businessService.sendClaimingEmail(this.businessId).pipe()
      .subscribe(() => {
        this.router.navigate(['check-email'], { queryParams: { id: this.businessId } });
      });
  }

  goToFilter() {
    this.router.navigate(['/business-portal/search-filter'], {
      queryParams: { ...this.params },
    });
  }

  ngOnDestroy(): void {
  }

}
