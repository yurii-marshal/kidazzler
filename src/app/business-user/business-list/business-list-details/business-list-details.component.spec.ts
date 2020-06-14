import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessListDetailsComponent } from './business-list-details.component';

describe('BusinessListDetailsComponent', () => {
  let component: BusinessListDetailsComponent;
  let fixture: ComponentFixture<BusinessListDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessListDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
