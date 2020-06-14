import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedByFriendsComponent } from './added-by-friends.component';

describe('AddedByFriendsComponent', () => {
  let component: AddedByFriendsComponent;
  let fixture: ComponentFixture<AddedByFriendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddedByFriendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddedByFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
