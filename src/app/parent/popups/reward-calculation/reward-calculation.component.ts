import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { take } from 'rxjs/operators';

import { UserRole } from '../../../core/shared/enums/user-role.enum';
import { AccountService } from '../../../core/account.service';
import { UserService } from '../../../core/user.service';
import { RewardInfo, RewardInfoItem, RewardType } from '../../../core/shared/reward-info';
import { UserProfile } from '../../../user/shared/user-profile.model';

interface RewardCalculationUi {
  title: string;
  firstLevel: string;
  secondLevel: string;
  thirdLevel: string;
  howItWorksLink: string;
}

@Component({
  templateUrl: './reward-calculation.component.html',
  styleUrls: ['./reward-calculation.component.scss', '../../parent.scss']
})
export class RewardCalculationComponent implements OnInit {
  rewardInfo: RewardInfo = {
    perBusiness: {
      own: 0,
      secondLevel: 0,
      thirdLevel: 0,
    },
    businessesCount: {
      own: 0,
      secondLevel: 0,
      thirdLevel: 0,
    },
    memberBusinessesCount: {
      own: 0,
      secondLevel: 0,
      thirdLevel: 0,
    },
    actualTotal: 0,
    total: 0,
  };
  profile: UserProfile;
  visible: boolean = true;
  isOrganization: boolean;
  isThirdLevelLocked: boolean;
  currentCountKey: string;
  currentTotalKey: string;
  _rewardType: RewardType;

  uiData: { [key in RewardType]: RewardCalculationUi } = {
    [RewardType.actual]: {
      title: 'Actual Earnings',
      firstLevel: 'Businesses added by YOU',
      secondLevel: 'Businesses added by your FRIENDS',
      thirdLevel: 'Businesses added by FRIENDS of YOUR FRIENDS',
      howItWorksLink: 'https://blog.kidazzler.com/actual-rewards/',
    },
    [RewardType.potential]: {
      title: 'Potential Earnings',
      firstLevel: 'Businesses added by YOU',
      secondLevel: 'Businesses added by your FRIENDS',
      thirdLevel: 'Businesses added by FRIENDS of YOUR FRIENDS',
      howItWorksLink: 'https://blog.kidazzler.com/actual-rewards/',
    },
  };

  private readonly FRIENDS_COUNT_THIRD_LEVEL: number = 15;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.getRewardType();
    this.getRewardInfo();
    this.getUserProfile((p: UserProfile) => {
      this.isOrganization = p.role === UserRole.Organization;
      this.isThirdLevelLocked = p.friendsCount < this.FRIENDS_COUNT_THIRD_LEVEL;
    });
  }

  set rewardType(type: RewardType) {
    this._rewardType = type;
    switch (type) {
      case RewardType.actual:
        this.currentCountKey = 'memberBusinessesCount';
        this.currentTotalKey = 'actualTotal';
        break;
      case RewardType.potential:
        this.currentCountKey = 'businessesCount';
        this.currentTotalKey = 'total';
        break;
    }
  }

  get rewardType() {
    return this._rewardType;
  }

  getRewardInfo() {
    this.accountService
      .getRewardInfo()
      .pipe(take(1))
      .subscribe(r => {
        this.rewardInfo = r;
      });
  }

  getUserProfile(cb) {
    this.userService.getProfileSnapshot().subscribe(p => {
      this.profile = p;
      if (cb) cb(p);
    });
  }

  getRewardType() {
    this.activatedRoute.paramMap.subscribe(p => {
      this.rewardType = p.get('type') as RewardType;
    });
  }

  onHide(): void {
    this.closeDialog();
  }

  closeDialog(): void {
    this.router.navigate([{ outlets: { popup: null } }]);
  }
}
