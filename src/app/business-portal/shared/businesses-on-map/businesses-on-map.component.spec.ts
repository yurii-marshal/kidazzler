import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessesOnMapComponent } from './businesses-on-map.component';

describe('BusinessesOnMapComponent', () => {
  let component: BusinessesOnMapComponent;
  let fixture: ComponentFixture<BusinessesOnMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessesOnMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessesOnMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
