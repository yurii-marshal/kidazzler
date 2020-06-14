import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './business-added.component.html',
  styleUrls: ['../../parent.scss']
})
export class BusinessAddedComponent {
  constructor(private router: Router) {}

  closeDialog() {
    this.router.navigate([{ outlets: { popup: null } }]);
  }

  onHide() {
    this.closeDialog();
  }
}
