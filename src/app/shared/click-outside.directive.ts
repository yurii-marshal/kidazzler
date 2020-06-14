import {
    Directive,
    ElementRef,
    Output,
    EventEmitter,
    AfterViewInit,
    OnDestroy,
    NgZone,
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

/**
 * @example
 *
 * <div class="block" clickOutside (clickOutside)="clickOutside()"></div>
 *
 */
@Directive({
    selector: '[clickOutside]',
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy {
    /** Output event fires when block clicked outside of his borders */
    @Output() clickOutside = new EventEmitter();

    public documentListener: Subscription;

    constructor(
        private zone: NgZone,
        private _elementRef: ElementRef,
    ) {
    }

    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            this.documentListener = fromEvent(document, 'click')
                .subscribe((res) => {
                    const clickedInside = this._elementRef.nativeElement.contains(res['target']);
                    if (!clickedInside) {
                        this.zone.run(() => {
                            this.clickOutside.emit(null);
                        });
                    }
                });
        });
    }

    ngOnDestroy() {
        this.documentListener.unsubscribe();
    }
}
