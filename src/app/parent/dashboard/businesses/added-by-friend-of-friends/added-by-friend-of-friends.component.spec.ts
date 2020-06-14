import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedByFriendOfFriendsComponent } from './added-by-friend-of-friends.component';

describe('AddedByFriendOfFriendsComponent', () => {
  let component: AddedByFriendOfFriendsComponent;
  let fixture: ComponentFixture<AddedByFriendOfFriendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddedByFriendOfFriendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddedByFriendOfFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
