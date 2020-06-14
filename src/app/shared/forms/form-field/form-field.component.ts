import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import { AbstractControlDirective, ControlContainer, NgControl } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

import { KzFormDirective } from '../form.directive';
import { ERROR_MESSAGES, ErrorMessages } from '../../../core/shared/error-messages';

export abstract class BaseFormFieldComponent implements OnInit {
  @Input() errorDisplay: 'submit' | 'dirty' = 'submit';
  protected control: AbstractControlDirective;

  get error(): string {
    if (this.control.invalid && this.control.errors) {
      let error: string;

      if (this.control.hasError('required')) {
        error = 'required';
      } else {
        [error] = Object.keys(this.control.errors);
      }

      return this.errorMessages[error];
    }

    return null;
  }

  get shouldShowError(): boolean {
    return (
      this.control.invalid &&
      this.control.errors &&
      (this.form.submitted || (this.errorDisplay === 'dirty' && this.control.dirty))
    );
  }

  constructor(
    protected form: KzFormDirective,
    protected errorMessages: ErrorMessages,
    protected element: ElementRef,
    protected document: Document,
  ) {}

  ngOnInit() {
    this.form.registerField(this);
  }

  scrollIntoView() {
    const scrollingElement = this.document.scrollingElement || this.document.documentElement;

    setTimeout(() => (scrollingElement.scrollTop = this.element.nativeElement.offsetTop - 90), 0);
  }
}

@Component({
  selector: 'kz-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
})
export class KzFormFieldComponent extends BaseFormFieldComponent implements AfterContentInit {
  @ContentChild(NgControl) control: NgControl;

  constructor(
    form: KzFormDirective,
    @Inject(ERROR_MESSAGES) errorMessages,
    element: ElementRef,
    @Inject(DOCUMENT) document: Document,
  ) {
    super(form, errorMessages, element, document);
  }

  ngAfterContentInit() {
    if (!this.control) {
      throw new Error('KzFormFieldComponent requires a child control.');
    }
  }
}

@Component({
  selector: 'kz-form-group',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
})
export class KzFormGroupComponent extends BaseFormFieldComponent {
  @HostBinding('attr.class') private type = 'group';

  // todo: Check why ControlContainer injection throws error in AOT when not @Optional
  constructor(
    @Optional() @Self() group: ControlContainer,
    form: KzFormDirective,
    @Inject(ERROR_MESSAGES) errorMessages,
    element: ElementRef,
    @Inject(DOCUMENT) document: Document,
  ) {
    super(form, errorMessages, element, document);

    if (!group) {
      throw new Error('KzFormGroupComponent requires a form group.');
    }

    this.control = group;
  }
}
