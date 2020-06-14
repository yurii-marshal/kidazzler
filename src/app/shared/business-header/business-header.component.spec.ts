import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessHeaderComponent } from './business-header.component';

describe('BusinessHeaderComponent', () => {
  let component: BusinessHeaderComponent;
  let fixture: ComponentFixture<BusinessHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
