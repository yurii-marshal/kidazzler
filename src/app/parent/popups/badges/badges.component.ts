import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { BadgesService } from '../../../core/badges.service';
import { AccountService } from '../../../core/account.service';

@Component({
  templateUrl: './badges.component.html',
  styleUrls: ['../../parent.scss']
})
export class BadgesComponent implements OnInit {
  visible: boolean;
  type: string;
  isLoading: Subscription;
  badges: any;
  userBadges: any;

  constructor(
    private badgesService: BadgesService,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.type = this.route.snapshot.params['type'];

    this.badgesService.getBadges({ type: capitalizeFirstLetter(this.type) }).subscribe(badges => {
      this.badges = badges.filter(badge => badge.points > 0);

      this.visible = true;
    });

    this.accountService.getBadgesInfo().subscribe(data => (this.userBadges = data));
  }

  isActive(badge) {
    if (!this.userBadges) return;

    return this.userBadges[this.type + 'Badge'].points >= badge.points;
  }

  onHide() {
    this.closeDialog();
  }

  closeDialog() {
    this.router.navigate([{ outlets: { popup: null } }]);
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
