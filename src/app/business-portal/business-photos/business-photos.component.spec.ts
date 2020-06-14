import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPhotosComponent } from './business-photos.component';

describe('BusinessPhotosComponent', () => {
  let component: BusinessPhotosComponent;
  let fixture: ComponentFixture<BusinessPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessPhotosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
