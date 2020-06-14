import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BadgesService } from '../../../core/badges.service';
import { untilComponentDestroyed } from '../../../shared/componentDestroyed';

@Component({
  templateUrl: './unlock-rewards.component.html',
  styleUrls: ['./unlock-rewards.component.scss', '../../parent.scss'],
})
export class UnlockRewardsComponent implements OnInit, OnDestroy {
  badges: any;

  constructor(private router: Router, private badgesService: BadgesService) {
  }

  ngOnInit() {
    this.badgesService.getBadges().pipe(untilComponentDestroyed(this))
      .subscribe(badges => {
        this.badges = badges;
      });
  }

  onHide(): void {
    this.closeDialog();
  }

  closeDialog(): void {
    this.router.navigate([{ outlets: { popup: null } }]);
  }
  ngOnDestroy() {

  }
}
