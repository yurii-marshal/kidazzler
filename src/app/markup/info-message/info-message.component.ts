import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kz-info-message',
  templateUrl: './info-message.component.html',
})
export class InfoMessageComponent implements OnInit {
  hidden = false;

  constructor() {}

  ngOnInit() {}

  toggle(): void {
    this.hidden = !this.hidden;
  }
}
