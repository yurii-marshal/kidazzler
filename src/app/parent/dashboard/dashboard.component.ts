import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { AccountService } from '../../core/account.service';
import { RewardInfo, RewardType } from '../../core/shared/reward-info';
import { UserService } from '../../core/user.service';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';
import { UserProfile } from '../../user/shared/user-profile.model';
import { UserRole } from '../../core/shared/enums/user-role.enum';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', '../parent.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  RewardType = RewardType;
  rewardInfo: RewardInfo;
  reward: number = 0;
  _activeTab: RewardType;
  profile: UserProfile;
  isOrganization: boolean;

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
    this.getRewardInfo(() => {
      this.activeTab = RewardType.potential;
    });
  }

  set activeTab(tab: RewardType) {
    this._activeTab = tab;
    this.toggleReward(tab);
  }

  get activeTab(): RewardType {
    return this._activeTab;
  }

  getRewardInfo(cb) {
    this.accountService.getRewardInfo().subscribe(r => {
      this.rewardInfo = r;
      cb();
    });
  }

  toggleReward(tab: RewardType) {
    switch (tab) {
      case RewardType.actual:
        this.reward = this.rewardInfo.actualTotal;
        break;
      case RewardType.potential:
        this.reward = this.rewardInfo.total;
        break;
    }
  }

  ngOnDestroy(): void {
  }
}
