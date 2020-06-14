import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneVerificationSubmitComponent } from './phone-verification-submit.component';

describe('PhoneVerificationSubmitComponent', () => {
  let component: PhoneVerificationSubmitComponent;
  let fixture: ComponentFixture<PhoneVerificationSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhoneVerificationSubmitComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneVerificationSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
