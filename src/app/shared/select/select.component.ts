import {
  Component,
  ElementRef, HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  Renderer2,
  Self,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { SPACE } from '@angular/cdk/keycodes';

import { Subject } from 'rxjs';

@Component({
  selector: 'kz-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class KzSelectComponent implements ControlValueAccessor, OnChanges, OnDestroy {
  @Input() options: any[];
  @Input() customOption: boolean;
  @Input() displayWith: string;
  @Input() valueAs: string;
  @Input() placeholder: string;

  @Output() search = new Subject<string>();

  onChange: (value: any) => void;
  onTouched: () => void;
  @Input()
  @HostBinding('class.processing')
  searchPredicate: string;
  isOpened: boolean;
  @ViewChild('panel') panel: ElementRef;
  @ViewChild('toggleButton') toggleButton: ElementRef;

  private selected: any;
  private documentClickListener: () => void;
  private inputClick: boolean;

  constructor(
    private element: ElementRef,
    @Self() @Optional() private control: NgControl,
    private renderer: Renderer2,
  ) {
    if (this.control) {
      this.control.valueAccessor = this;
    }

    this.onChange = () => null;
    this.onTouched = () => null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      if (this.hasOptions()) {
        // if control has some default value but there was no options on initialization
        if (this.control.value && this.control.value !== this.getOptionValue(this.selected)) {
          this.selected = this.getSelectionByValue(this.control.value);
          this.searchPredicate = this.getOptionDisplay(this.selected);
        }
      }
    }
  }

  ngOnDestroy() {
    this.unbindDocumentClickListener();
  }

  writeValue(value: any): void {
    if (this.hasOptions()) {
      this.selected = this.getSelectionByValue(value);
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  toggle() {
    this.isOpened ? this.close() : this.open();
  }

  open(): void {
    if (this.isOpened) return;

    this.bindDocumentClickListener();

    this.isOpened = true;
  }

  close(): void {
    if (this.isOpened) {
      this.isOpened = false;

      const selected = this.getSelectionBySearch();
      if (selected && this.getOptionValue(selected) !== this.getOptionValue(this.selected)) {
        this.setSelected(selected);
        this.searchPredicate = this.getOptionDisplay(selected);
      }

      if (!this.selected && this.customOption && this.searchPredicate) {
        this.setCustomSelection();
      }

      if (!this.selected) this.searchPredicate = '';

      this.onTouched();
    }
  }

  getOptionDisplay(option: any): string {
    if (!option) return '';

    if (this.displayWith) return option[this.displayWith];

    return option.toString();
  }

  onSelection(option: any) {
    this.setSelected(option);

    this.searchPredicate = this.getOptionDisplay(option);

    this.close();
  }

  onSearch() {
    if (this.customOption && this.searchPredicate) {
      this.setCustomSelection();
    } else {
      this.setSelected(null);
    }

    this.open();

    this.search.next(this.searchPredicate);
  }

  hasOptions(): boolean {
    return !!(this.options && this.options.length);
  }

  onInputClick(event: MouseEvent) {
    if (this.documentClickListener) {
      this.inputClick = true;
    }
  }

  onInputKeyDown(event: KeyboardEvent) {
    if (!this.searchPredicate && event.keyCode === SPACE) {
      event.stopPropagation();
      event.preventDefault();
      return false;
    }
  }

  private setSelected(option: any) {
    // if (this.getOptionValue(option) === this.getOptionValue(this.selected)) return; //!!!!!!!!!!!

    this.selected = option;

    this.onChange(this.getOptionValue(option));
  }

  private setCustomSelection() {
    this.setSelected(
      this.displayWith ? { [this.displayWith]: this.searchPredicate } : this.searchPredicate,
    );
  }

  private getSelectionByValue(value: any) {
    if (!this.hasOptions()) return null;

    return this.options.find(option => this.getOptionValue(option) === value);
  }

  private getSelectionBySearch() {
    if (!this.hasOptions() || !this.searchPredicate) return null;

    return this.options.find(
      option => this.getOptionDisplay(option).toLowerCase() === this.searchPredicate.toLowerCase(),
    );
  }

  private getOptionValue(option: any): any {
    if (!option) return null;

    if (this.valueAs) return option[this.valueAs];

    return option;
  }

  private bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = this.renderer.listen('document', 'click', event => {
        if (event.which === 3) {
          return;
        }

        if (!this.inputClick && !this.isDropdownClick(event)) {
          this.close();
        }

        this.inputClick = false;
      });
    }
  }

  private isDropdownClick(event) {
    if (this.panel) {
      const target = event.target;

      return (
        target === this.toggleButton.nativeElement ||
        target.parentNode === this.toggleButton.nativeElement
      );
    }

    return false;
  }

  private unbindDocumentClickListener() {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = null;
    }
  }
}
