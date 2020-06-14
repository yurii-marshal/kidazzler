import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, Renderer2, ViewContainerRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

interface AppWindow extends Window {
  postAppMessage(message: any): void;
}

declare let window: AppWindow;

@Component({
  selector: 'kz-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platform: any,
  ) {
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (!event.url.includes('/dashboard')) {
          const scrollingElement = this.document.scrollingElement || this.document.documentElement;
          this.renderer.setProperty(scrollingElement, 'scrollTop', 0);
        }
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => window.postAppMessage('APP_ROOT_LOADED'), 0);
  }
}
