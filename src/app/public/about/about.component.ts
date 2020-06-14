import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../core/user.service';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';
import { UserProfile } from '../../user/shared/user-profile.model';

@Component({
  selector: 'kz-about-page',
  templateUrl: './about.component.html',
  styleUrls: ['../public.scss'],
})
export class AboutComponent implements OnInit, OnDestroy {
  profile: UserProfile;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    // this.userService.getProfileSnapshot().pipe(untilComponentDestroyed(this))
    //   .subscribe((profile: UserProfile) => {
    //     this.profile = profile;
    //   }, (err) => {
    //     console.log(err);
    //   });
  }

  ngOnDestroy(): void {
  }
}
