import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessListCardComponent } from './business-list-card.component';

describe('BusinessListCardComponent', () => {
  let component: BusinessListCardComponent;
  let fixture: ComponentFixture<BusinessListCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessListCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
