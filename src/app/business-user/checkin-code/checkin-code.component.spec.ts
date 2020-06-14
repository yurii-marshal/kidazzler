import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinCodeComponent } from './checkin-code.component';

describe('CheckinCodeComponent', () => {
  let component: CheckinCodeComponent;
  let fixture: ComponentFixture<CheckinCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckinCodeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
