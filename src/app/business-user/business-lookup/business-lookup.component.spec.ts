import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessLookupComponent } from './business-lookup.component';

describe('BusinessLookupComponent', () => {
  let component: BusinessLookupComponent;
  let fixture: ComponentFixture<BusinessLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
