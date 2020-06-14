import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSearchErrorToastComponent } from './map-search-error-toast.component';

describe('MapSearchErrorToastComponent', () => {
  let component: MapSearchErrorToastComponent;
  let fixture: ComponentFixture<MapSearchErrorToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapSearchErrorToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSearchErrorToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
