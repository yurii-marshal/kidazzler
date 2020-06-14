import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedByMeComponent } from './added-by-me.component';

describe('AddedByMeComponent', () => {
  let component: AddedByMeComponent;
  let fixture: ComponentFixture<AddedByMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddedByMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddedByMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
