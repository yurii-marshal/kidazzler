import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealPhotosComponent } from './deal-photos.component';

describe('DealPhotosComponent', () => {
  let component: DealPhotosComponent;
  let fixture: ComponentFixture<DealPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DealPhotosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
