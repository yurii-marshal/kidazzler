import { Component, Input } from '@angular/core';

@Component({
  selector: 'kz-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() type: string;
  @Input() hideAbout: boolean;

  constructor(
  ) {
  }
}
