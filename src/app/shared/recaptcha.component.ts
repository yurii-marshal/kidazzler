import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { environment } from '../../environments/environment';

export const RECAPTCHA_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RecaptchaComponent),
  multi: true,
};

@Component({
  selector: 'kz-recaptcha',
  template: `
    <div #recaptchaContainer></div>
  `,
  providers: [RECAPTCHA_VALUE_ACCESSOR],
})
export class RecaptchaComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @ViewChild('recaptchaContainer') private container: ElementRef;
  private onResponse: (_: any) => void;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  writeValue(obj: any): void {}

  registerOnChange(fn: (value: any) => void): void {
    this.onResponse = fn;
  }

  registerOnTouched(fn: (_: any) => void): void {}

  ngOnInit() {
    window['onReacaptchaApiLoaded'] = () => {
      this.onRecaptchaApiLoaded();
    };
  }

  ngAfterViewInit() {
    this.loadRecaptchaApi();
  }

  private loadRecaptchaApi() {
    const scriptElement = this.renderer.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.async = true;
    scriptElement.defer = true;
    scriptElement.src =
      'https://www.google.com/recaptcha/api.js?onload=onReacaptchaApiLoaded&render=explicit';

    this.renderer.appendChild(this.elementRef.nativeElement, scriptElement);
  }

  private onRecaptchaApiLoaded() {
    window['grecaptcha'].render(this.container.nativeElement, {
      sitekey: environment.recaptcha.sitekey,
      callback: recaptchaResponse => {
        this.onResponse(recaptchaResponse);
      },
    });
  }
}
