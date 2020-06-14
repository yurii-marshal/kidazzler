import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { BACKSPACE, COMMA, ENTER, SEMICOLON, SPACE } from '@angular/cdk/keycodes';

const ITEMS_DELIMITER = /[ \n;,]+/;
const ITEMS_KEY_DELIMITERS: any[] = [SPACE, ENTER, SEMICOLON, COMMA];

@Component({
  selector: 'kz-list-input',
  templateUrl: './list-input.component.html',
  styleUrls: ['./list-input.component.scss'],
})
export class KzListInputComponent implements ControlValueAccessor, OnInit {
  @Input() disabled: boolean;

  @Input() placeholder: string;

  @Input() id: string;

  @ViewChild('input') inputRef: ElementRef;
  value: any[];
  onChange: (value: any[]) => void;
  onTouched: () => void;

  private cachedErrors: { [item: string]: string } = {};

  constructor(@Self() @Optional() private control: NgControl) {
    this.onChange = () => null;
    this.onTouched = () => null;

    if (this.control) {
      this.control.valueAccessor = this;
    }
  }

  ngOnInit() {
    if (this.control) {
      this.control.statusChanges.subscribe(() => this.setCachedErrors());
    }
  }

  writeValue(value: any[]): void {
    this.value = value;
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  @HostListener('click')
  onClick() {
    this.inputRef.nativeElement.focus();
  }

  removeItem(index: number): void {
    if (this.disabled) {
      return;
    }

    const value = this.value.filter((item, i) => i !== index);
    this.value = value;
    this.onChange(this.value.length ? this.value : null);
  }

  onInputBlur(event: FocusEvent) {
    if (this.inputRef.nativeElement.value) {
      this.addItem(this.inputRef.nativeElement.value);
      this.inputRef.nativeElement.value = '';
    }

    this.onTouched();
  }

  onPaste(event: ClipboardEvent): void {
    const text = this.inputRef.nativeElement.value + event.clipboardData.getData('text');
    const items = text.split(ITEMS_DELIMITER);

    if (items.length > 1) {
      event.preventDefault();
      this.inputRef.nativeElement.value = '';

      let value = this.value || [];
      value = value.concat(items);

      this.value = value;
      this.onChange(this.value);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const key = event.which;

    if (
      key === BACKSPACE &&
      this.inputRef.nativeElement.value.length === 0 &&
      this.value &&
      this.value.length > 0
    ) {
      this.removeItem(this.value.length - 1);
    } else if (ITEMS_KEY_DELIMITERS.includes(key)) {
      this.addItem(this.inputRef.nativeElement.value);
      this.inputRef.nativeElement.value = '';

      event.preventDefault();
    }
  }

  addItem(item: string): void {
    this.value = this.value || [];

    if (item && item.trim().length) {
      this.value = [...this.value, item];
      this.onChange(this.value);
    }
  }

  getError(item: string, index: number): string {
    if (this.cachedErrors[item]) return this.cachedErrors[item];

    const listErrors = this.getListErrors();

    for (const error of listErrors) {
      if (error.indices && error.indices.includes(index)) {
        return error.message;
      } else if (error.items && error.items.includes(item)) {
        return error.message;
      }
    }

    return null;
  }

  private getListErrors(): any[] {
    if (!this.control.invalid) return [];

    return Object.keys(this.control.errors)
      .map(errorCode => this.control.getError(errorCode))
      .filter(error => error.indices || error.items);
  }

  private setCachedErrors() {
    this.getListErrors()
      .filter(error => error.cache)
      .forEach(error => {
        if (error.indices) {
          error.indices.forEach(index => (this.cachedErrors[this.value[index]] = error.message));
        } else if (error.items) {
          error.items.forEach(item => (this.cachedErrors[item] = error.message));
        }
      });
  }
}
