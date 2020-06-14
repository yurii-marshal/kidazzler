import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPhotosComponent } from './event-photos.component';

describe('EventPhotosComponent', () => {
  let component: EventPhotosComponent;
  let fixture: ComponentFixture<EventPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventPhotosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
