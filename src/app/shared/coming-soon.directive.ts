import { Directive, ElementRef, HostBinding, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[kzComingSoon]',
})
export class ComingSoonDirective implements OnInit {

  constructor(private renderer: Renderer2, private element: ElementRef) {
  }

  ngOnInit() {
    const div = this.renderer.createElement('div');
    const text = this.renderer.createText('Coming soon...');

    this.renderer.appendChild(div, text);
    this.renderer.appendChild(this.element.nativeElement, div);

    this.renderer.addClass(this.element.nativeElement, 'coming-soon');
    this.renderer.addClass(div, 'coming-soon__text');
  }

}
