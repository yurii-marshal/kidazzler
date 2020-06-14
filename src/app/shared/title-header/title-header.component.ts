import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'kz-title-header',
  templateUrl: './title-header.component.html',
  styleUrls: ['./title-header.component.scss'],
})
export class TitleHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() isShownBack = true;
  @Input() isShownClear = false;
  @Input() isClearActive = false;
  @Input() isTransparent = false;
  @Input() isStatic = false;
  @Input() isWhite = false;
  @Input() isShownEdit = false;
  @Input() isShownCancel = false;
  @Input() isBackByLocation = false;
  @Input() isBackHandler = false;

  @Output() onClear = new EventEmitter();
  @Output() onEdit = new EventEmitter();
  @Output() onBack = new EventEmitter();

  constructor(private location: Location, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
  }

  goBack(): void {
    if (this.isBackHandler) {
      this.onBack.emit(true);
      return;
    }

    if (this.isBackByLocation) {
      this.location.back();
    } else {
      this.router.navigate([this.router.url.replace(/[^\/]+$/, '')]);
    }
  }

  clear(): void {
    this.onClear.emit();
  }

  edit(): void {
    this.onEdit.emit();
  }
}
