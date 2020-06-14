import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

import { UserService } from '../../../core/user.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './max-level-producer.component.html',
  styleUrls: ['../../parent.scss']
})
export class MaxLevelProducerComponent implements OnInit {
  businessesCount$: Observable<number>;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.businessesCount$ = this.userService
      .getProfileSnapshot()
      .pipe(map(profile => profile.businessesCount));
  }

  close() {
    this.router.navigate([{ outlets: { popup: null } }]);
  }
}
