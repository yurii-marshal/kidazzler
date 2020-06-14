import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSnapshotComponent } from './location-snapshot.component';

describe('LocationSnapshotComponent', () => {
  let component: LocationSnapshotComponent;
  let fixture: ComponentFixture<LocationSnapshotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationSnapshotComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
