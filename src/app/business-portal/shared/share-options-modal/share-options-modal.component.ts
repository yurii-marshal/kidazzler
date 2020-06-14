import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'kz-share-options-modal',
  templateUrl: './share-options-modal.component.html',
  styleUrls: ['./share-options-modal.component.scss'],
})
export class ShareOptionsModalComponent implements OnInit, OnChanges {
  @Input() isShownSharePopup = false;
  @Input() referralSignupUrl: string;
  @Output() onClose = new EventEmitter();

  constructor(
    private clipboardService: ClipboardService,
    private toastr: ToastrService,
    ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isShownSharePopup'].currentValue) {
      this.isShownSharePopup = changes['isShownSharePopup'].currentValue;
    }
  }

  ngOnInit() {
  }

  copyLink(): void {
    this.clipboardService.copyFromContent(this.referralSignupUrl);
    this.toastr.success('Link was successfully copied');
  }

  closePopup() {
    this.isShownSharePopup = false;
    this.onClose.emit(this.isShownSharePopup);
  }
}
