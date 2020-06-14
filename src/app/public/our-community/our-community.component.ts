import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../core/user.service';
import { untilComponentDestroyed } from '../../shared/componentDestroyed';
import { UserProfile } from '../../user/shared/user-profile.model';

@Component({
  selector: 'kz-our-community',
  templateUrl: './our-community.component.html',
  styleUrls: ['./our-community.component.scss', '../public.scss']
})
export class OurCommunityComponent implements OnInit, OnDestroy {
  profile: UserProfile;

  constructor(private userService: UserService) { }

  ngOnInit() {
    // this.userService.getProfileSnapshot().pipe(untilComponentDestroyed(this))
    //   .subscribe((profile: UserProfile) => {
    //     this.profile = profile;
    //   });
  }

  ngOnDestroy() {

  }

}
