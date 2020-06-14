import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'kz-input-switcher',
  templateUrl: './input-switcher.component.html',
})
export class InputSwitcherComponent {
  @Output() onSwitch = new EventEmitter();
  @Input() value: Boolean;

  constructor() {}

  onChange(event) {
    this.onSwitch.emit(event.target.checked);
    this.value = event.target.checked;
  }
}
