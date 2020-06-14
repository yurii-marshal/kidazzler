import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessType } from '../../../core/shared/business-type.model';
import { UserService } from '../../../core/user.service';
import { UserProfile } from '../../../user/shared/user-profile.model';

@Component({
  selector: 'kz-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  @Input() categories: BusinessType[];
  @Input() currentCategory: BusinessType;
  private user: UserProfile;

  constructor(private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getProfile().subscribe((data) => {
      this.user = data;
    });
  }

  navigateToSubCategories(category) {
    this.router.navigate(['/business-portal/category', category.id, 'sub-categories'], {
      queryParams: {
        category: category && category.code,
        location: `${this.user.city}, ${this.user.country}`
      },
    });
  }

  showAllCategories() {
    this.router.navigate(['/business-portal/all-categories'], {
      queryParams: { category: this.currentCategory && this.currentCategory.id},
    });
  }
}
